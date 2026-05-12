import { IsOptional, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { StatusContaPagar, RecorrenciaContaPagar } from '../conta-pagar.entity';

export class UpdateContaPagarDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  descricao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  fornecedor?: string;

  @IsOptional()
  @IsDateString()
  dataVencimento?: string;

  @IsOptional()
  @IsEnum(RecorrenciaContaPagar)
  recorrencia?: RecorrenciaContaPagar;

  @IsOptional()
  @IsEnum(StatusContaPagar)
  status?: StatusContaPagar;
}
