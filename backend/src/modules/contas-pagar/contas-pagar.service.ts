import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaPagar, StatusContaPagar } from './conta-pagar.entity';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { UpdateContaPagarDto } from './dto/update-conta-pagar.dto';

@Injectable()
export class ContasPagarService {
  constructor(
    @InjectRepository(ContaPagar)
    private readonly repo: Repository<ContaPagar>,
  ) {}

  async criar(dto: CreateContaPagarDto, empresaId: string): Promise<ContaPagar> {
    const conta = this.repo.create({ ...dto, empresaId });
    return this.repo.save(conta);
  }

  async listar(empresaId: string, page = 1, limit = 50) {
    const [data, total] = await this.repo.findAndCount({
      where: { empresaId },
      order: { dataVencimento: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async buscarPorId(id: string, empresaId: string): Promise<ContaPagar> {
    const conta = await this.repo.findOne({ where: { id, empresaId } });
    if (!conta) throw new NotFoundException('Conta a pagar não encontrada');
    return conta;
  }

  async atualizar(id: string, dto: UpdateContaPagarDto, empresaId: string): Promise<ContaPagar> {
    const conta = await this.buscarPorId(id, empresaId);

    if (conta.status === StatusContaPagar.PAGA && dto.valor !== undefined) {
      throw new BadRequestException('Não é possível alterar o valor de uma conta já paga');
    }

    Object.assign(conta, dto);
    return this.repo.save(conta);
  }

  // Chamado pela conciliação ERP ao vincular lançamento bancário
  async marcarComoPaga(id: string, empresaId: string): Promise<ContaPagar> {
    const conta = await this.buscarPorId(id, empresaId);
    if (conta.status === StatusContaPagar.PAGA) {
      throw new BadRequestException('Conta já marcada como paga');
    }
    conta.status = StatusContaPagar.PAGA;
    return this.repo.save(conta);
  }
}
