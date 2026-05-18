import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conciliacao } from './conciliacao.entity';
import { ExtratoLancamento } from '../extratos/extrato-lancamento.entity';
import { ContaPagar } from '../contas-pagar/conta-pagar.entity';
import { ContaReceber } from '../contas-receber/conta-receber.entity';
import { ConciliacaoService } from './conciliacao.service';
import { ConciliacaoController } from './conciliacao.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { PermissoesGuardModule } from '../../common/guards/permissoes-guard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conciliacao, ExtratoLancamento, ContaPagar, ContaReceber]),
    AuditoriaModule,
    PermissoesGuardModule,
  ],
  providers: [ConciliacaoService],
  controllers: [ConciliacaoController],
  exports: [ConciliacaoService],
})
export class ConciliacaoModule {}
