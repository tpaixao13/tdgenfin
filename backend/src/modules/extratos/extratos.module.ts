import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ExtratoImportacao } from './extrato-importacao.entity';
import { ExtratoLancamento } from './extrato-lancamento.entity';
import { ContaBancaria } from '../contas-bancarias/conta-bancaria.entity';
import { ExtratosService } from './extratos.service';
import { ExtratosController } from './extratos.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { PermissoesGuardModule } from '../../common/guards/permissoes-guard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExtratoImportacao, ExtratoLancamento, ContaBancaria]),
    MulterModule.register({ dest: './uploads' }),
    AuditoriaModule,
    PermissoesGuardModule,
  ],
  providers: [ExtratosService],
  controllers: [ExtratosController],
  exports: [ExtratosService],
})
export class ExtratosModule {}
