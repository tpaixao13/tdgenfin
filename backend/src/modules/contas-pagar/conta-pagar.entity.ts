import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../empresas/empresa.entity';

export enum StatusContaPagar {
  ABERTA = 'ABERTA',
  PAGA = 'PAGA',
  CANCELADA = 'CANCELADA',
}

export enum RecorrenciaContaPagar {
  NENHUMA = 'NENHUMA',
  SEMANAL = 'SEMANAL',
  MENSAL = 'MENSAL',
  TRIMESTRAL = 'TRIMESTRAL',
  ANUAL = 'ANUAL',
}

@Entity('conta_pagar')
export class ContaPagar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id', type: 'uuid' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ length: 300 })
  descricao: string;

  @Column({ length: 200, nullable: true })
  fornecedor: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  valor: number;

  @Column({ name: 'data_vencimento', type: 'date' })
  dataVencimento: string;

  @Column({
    type: 'enum',
    enum: RecorrenciaContaPagar,
    default: RecorrenciaContaPagar.NENHUMA,
  })
  recorrencia: RecorrenciaContaPagar;

  @Column({
    type: 'enum',
    enum: StatusContaPagar,
    default: StatusContaPagar.ABERTA,
  })
  status: StatusContaPagar;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
