import { SetMetadata } from '@nestjs/common';
import { ChavePermissao } from '../../modules/usuarios/usuario-permissao.entity';

export const PERMISSAO_KEY = 'requer_permissao';
export const RequerPermissao = (...permissoes: ChavePermissao[]) =>
  SetMetadata(PERMISSAO_KEY, permissoes);
