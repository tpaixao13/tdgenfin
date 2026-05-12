import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaReceber } from './conta-receber.entity';
import { ContasReceberService } from './contas-receber.service';
import { ContasReceberController } from './contas-receber.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContaReceber])],
  providers: [ContasReceberService],
  controllers: [ContasReceberController],
  exports: [ContasReceberService],
})
export class ContasReceberModule {}
