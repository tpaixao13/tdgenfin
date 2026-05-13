import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetSenhaDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  novaSenha: string;
}
