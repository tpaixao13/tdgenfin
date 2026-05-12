import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaReceber, StatusContaReceber } from './conta-receber.entity';
import { CreateContaReceberDto } from './dto/create-conta-receber.dto';
import { UpdateContaReceberDto } from './dto/update-conta-receber.dto';

@Injectable()
export class ContasReceberService {
  constructor(
    @InjectRepository(ContaReceber)
    private readonly repo: Repository<ContaReceber>,
  ) {}

  async criar(dto: CreateContaReceberDto, empresaId: string): Promise<ContaReceber> {
    const conta = this.repo.create({ ...dto, empresaId });
    return this.repo.save(conta);
  }

  async listar(empresaId: string, page = 1, limit = 50) {
    const [data, total] = await this.repo.findAndCount({
      where: { empresaId },
      order: { dataRecebimento: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async buscarPorId(id: string, empresaId: string): Promise<ContaReceber> {
    const conta = await this.repo.findOne({ where: { id, empresaId } });
    if (!conta) throw new NotFoundException('Conta a receber não encontrada');
    return conta;
  }

  async atualizar(id: string, dto: UpdateContaReceberDto, empresaId: string): Promise<ContaReceber> {
    const conta = await this.buscarPorId(id, empresaId);

    if (conta.status === StatusContaReceber.RECEBIDA && dto.valor !== undefined) {
      throw new BadRequestException('Não é possível alterar o valor de uma conta já recebida');
    }

    Object.assign(conta, dto);
    return this.repo.save(conta);
  }

  // Chamado pela conciliação ERP ao vincular lançamento bancário
  async marcarComoRecebida(id: string, empresaId: string): Promise<ContaReceber> {
    const conta = await this.buscarPorId(id, empresaId);
    if (conta.status === StatusContaReceber.RECEBIDA) {
      throw new BadRequestException('Conta já marcada como recebida');
    }
    conta.status = StatusContaReceber.RECEBIDA;
    return this.repo.save(conta);
  }
}
