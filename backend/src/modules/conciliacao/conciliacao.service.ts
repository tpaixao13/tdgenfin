import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Conciliacao, TipoConciliacao, StatusConciliacaoRegistro } from './conciliacao.entity';
import { ExtratoLancamento, StatusConciliacao } from '../extratos/extrato-lancamento.entity';
import { ContaPagar, StatusContaPagar } from '../contas-pagar/conta-pagar.entity';
import { ContaReceber, StatusContaReceber } from '../contas-receber/conta-receber.entity';
import { ConciliacaoManualDto } from './dto/conciliacao-manual.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AcaoAuditoria } from '../auditoria/auditoria-log.entity';

export interface ResultadoConciliacao {
  conciliados: number;
  pendentes: number;
  naoEncontrados: number;
}

function toDateStr(d: Date | string): string {
  if (d instanceof Date) return d.toISOString().split('T')[0];
  return String(d).split('T')[0];
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

@Injectable()
export class ConciliacaoService {
  constructor(
    @InjectRepository(Conciliacao)
    private readonly conciliacaoRepo: Repository<Conciliacao>,
    @InjectRepository(ExtratoLancamento)
    private readonly lancamentoRepo: Repository<ExtratoLancamento>,
    @InjectRepository(ContaPagar)
    private readonly contaPagarRepo: Repository<ContaPagar>,
    @InjectRepository(ContaReceber)
    private readonly contaReceberRepo: Repository<ContaReceber>,
    private readonly dataSource: DataSource,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  /**
   * Conciliação automática por conta.
   * CRÉDITO no extrato → busca Conta a Receber com mesmo valor e data ±5 dias.
   * DÉBITO no extrato  → busca Conta a Pagar com mesmo valor e data ±5 dias.
   */
  async executarAutomatica(
    contaId: string,
    empresaId: string,
    usuarioId: string,
  ): Promise<ResultadoConciliacao> {
    const lancamentos = await this.lancamentoRepo.find({
      where: [
        { contaId, empresaId, statusConciliacao: StatusConciliacao.PENDENTE },
        { contaId, empresaId, statusConciliacao: StatusConciliacao.NAO_ENCONTRADO },
      ],
      order: { data: 'ASC' },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let conciliados = 0;
    let naoEncontrados = 0;

    try {
      for (const lancamento of lancamentos) {
        const dataStr = toDateStr(lancamento.data as unknown as Date | string);
        const dataInicio = shiftDate(dataStr, -5);
        const dataFim = shiftDate(dataStr, 5);
        const valor = Number(lancamento.valor);

        let conciliacaoId: string | null = null;

        if (lancamento.tipo === 'CREDITO') {
          const cr = await queryRunner.manager.findOne(ContaReceber, {
            where: {
              empresaId,
              valor: valor as any,
              status: StatusContaReceber.ABERTA,
              dataRecebimento: Between(dataInicio, dataFim) as any,
            },
          });
          if (cr) {
            const conc = queryRunner.manager.create(Conciliacao, {
              empresaId,
              contaId,
              lancamentoExtratoId: lancamento.id,
              tipo: TipoConciliacao.AUTOMATICA,
              status: StatusConciliacaoRegistro.CONCILIADO,
              observacao: `Conta a Receber: ${cr.descricao}`,
              usuarioId,
            });
            const saved = await queryRunner.manager.save(conc);
            conciliacaoId = saved.id;
            await queryRunner.manager.update(ContaReceber, cr.id, {
              status: StatusContaReceber.RECEBIDA,
            });
            conciliados++;
          }
        } else {
          const cp = await queryRunner.manager.findOne(ContaPagar, {
            where: {
              empresaId,
              valor: valor as any,
              status: StatusContaPagar.ABERTA,
              dataVencimento: Between(dataInicio, dataFim) as any,
            },
          });
          if (cp) {
            const conc = queryRunner.manager.create(Conciliacao, {
              empresaId,
              contaId,
              lancamentoExtratoId: lancamento.id,
              tipo: TipoConciliacao.AUTOMATICA,
              status: StatusConciliacaoRegistro.CONCILIADO,
              observacao: `Conta a Pagar: ${cp.descricao}`,
              usuarioId,
            });
            const saved = await queryRunner.manager.save(conc);
            conciliacaoId = saved.id;
            await queryRunner.manager.update(ContaPagar, cp.id, {
              status: StatusContaPagar.PAGA,
            });
            conciliados++;
          }
        }

        if (conciliacaoId) {
          await queryRunner.manager.update(ExtratoLancamento, lancamento.id, {
            statusConciliacao: StatusConciliacao.CONCILIADO,
            conciliacaoId,
          });
        } else {
          await queryRunner.manager.update(ExtratoLancamento, lancamento.id, {
            statusConciliacao: StatusConciliacao.NAO_ENCONTRADO,
          });
          naoEncontrados++;
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    const pendentes = lancamentos.length - conciliados - naoEncontrados;

    await this.auditoriaService.registrar({
      usuarioId,
      empresaId,
      acao: AcaoAuditoria.CONCILIACAO_AUTOMATICA,
      entidade: 'conta_bancaria',
      entidadeId: contaId,
      dadosDepois: { conciliados, pendentes, naoEncontrados },
    });

    return { conciliados, pendentes, naoEncontrados };
  }

  async executarManual(
    dto: ConciliacaoManualDto,
    contaId: string,
    empresaId: string,
    usuarioId: string,
  ): Promise<Conciliacao> {
    const lancamento = await this.lancamentoRepo.findOne({
      where: { id: dto.lancamentoExtratoId, contaId, empresaId },
    });

    if (!lancamento) throw new NotFoundException('Lançamento não encontrado');

    if (lancamento.statusConciliacao === StatusConciliacao.CONCILIADO) {
      throw new BadRequestException('Lançamento já conciliado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const conciliacao = queryRunner.manager.create(Conciliacao, {
        empresaId,
        contaId,
        lancamentoExtratoId: lancamento.id,
        tipo: TipoConciliacao.MANUAL,
        status: StatusConciliacaoRegistro.CONCILIADO,
        observacao: dto.observacao,
        usuarioId,
      });
      const conciliacaoSalva = await queryRunner.manager.save(conciliacao);

      await queryRunner.manager.update(ExtratoLancamento, lancamento.id, {
        statusConciliacao: StatusConciliacao.CONCILIADO,
        conciliacaoId: conciliacaoSalva.id,
      });

      await queryRunner.commitTransaction();

      await this.auditoriaService.registrar({
        usuarioId,
        empresaId,
        acao: AcaoAuditoria.CONCILIACAO_MANUAL,
        entidade: 'extrato_lancamento',
        entidadeId: lancamento.id,
        dadosDepois: { tipo: TipoConciliacao.MANUAL, observacao: dto.observacao },
      });

      return conciliacaoSalva;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async estornar(conciliacaoId: string, empresaId: string, usuarioId: string): Promise<void> {
    const conciliacao = await this.conciliacaoRepo.findOne({
      where: { id: conciliacaoId, empresaId },
    });

    if (!conciliacao) throw new NotFoundException('Conciliação não encontrada');
    if (conciliacao.status === StatusConciliacaoRegistro.ESTORNADO) {
      throw new BadRequestException('Conciliação já estornada');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Conciliacao, conciliacaoId, {
        status: StatusConciliacaoRegistro.ESTORNADO,
      });

      await queryRunner.manager.update(ExtratoLancamento, conciliacao.lancamentoExtratoId, {
        statusConciliacao: StatusConciliacao.PENDENTE,
        conciliacaoId: null as unknown as string,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.auditoriaService.registrar({
      usuarioId,
      empresaId,
      acao: AcaoAuditoria.ESTORNO_CONCILIACAO,
      entidade: 'conciliacao',
      entidadeId: conciliacaoId,
    });
  }

  async listar(empresaId: string, contaId?: string, page = 1, limit = 50) {
    const where: Record<string, string> = { empresaId };
    if (contaId) where.contaId = contaId;

    const [data, total] = await this.conciliacaoRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: ['lancamentoExtrato'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }
}
