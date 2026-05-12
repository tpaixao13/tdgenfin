import { IsEnum, IsBoolean } from 'class-validator';
import { ChavePermissao } from '../usuario-permissao.entity';

export class UpdatePermissaoDto {
  @IsEnum(ChavePermissao)
  permissao: ChavePermissao;

  @IsBoolean()
  habilitado: boolean;
}
