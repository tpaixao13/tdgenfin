import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { RecorrenciaContaPagar } from '../conta-pagar.entity';

export class CreateContaPagarDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  descricao: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  fornecedor?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor: number;

  @IsDateString()
  dataVencimento: string;

  @IsOptional()
  @IsEnum(RecorrenciaContaPagar)
  recorrencia?: RecorrenciaContaPagar;
}
