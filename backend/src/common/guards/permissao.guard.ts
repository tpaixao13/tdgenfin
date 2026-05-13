import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { PERMISSAO_KEY } from '../decorators/requer-permissao.decorator';
import { Role } from '../../modules/usuarios/usuario.entity';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissoesRequeridas = this.reflector.getAllAndOverride<string[]>(
      PERMISSAO_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permissoesRequeridas?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.SUPER_ADMIN) return true;

    for (const chave of permissoesRequeridas) {
      const rows = await this.dataSource.query(
        `SELECT 1 FROM usuario_permissao WHERE usuario_id = $1 AND chave = $2 AND habilitado = true LIMIT 1`,
        [user.id, chave],
      );

      if (!rows.length) {
        throw new ForbiddenException(
          `Permissão insuficiente: ${chave} não habilitada para este usuário`,
        );
      }
    }

    return true;
  }
}
