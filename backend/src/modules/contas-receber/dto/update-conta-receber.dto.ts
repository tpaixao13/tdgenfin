import { IsOptional, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { StatusContaReceber } from '../conta-receber.entity';
import { RecorrenciaContaPagar } from '../../contas-pagar/conta-pagar.entity';

export class UpdateContaReceberDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  descricao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cliente?: string;

  @IsOptional()
  @IsDateString()
  dataRecebimento?: string;

  @IsOptional()
  @IsEnum(RecorrenciaContaPagar)
  recorrencia?: RecorrenciaContaPagar;

  @IsOptional()
  @IsEnum(StatusContaReceber)
  status?: StatusContaReceber;
}
