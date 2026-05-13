import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateContaBancariaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  banco?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  agencia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  numero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descricao?: string;
}
