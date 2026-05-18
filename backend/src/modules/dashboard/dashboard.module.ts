import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaBancaria } from '../contas-bancarias/conta-bancaria.entity';
import { ExtratoLancamento } from '../extratos/extrato-lancamento.entity';
import { ContaPagar } from '../contas-pagar/conta-pagar.entity';
import { ContaReceber } from '../contas-receber/conta-receber.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContaBancaria, ExtratoLancamento, ContaPagar, ContaReceber])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
