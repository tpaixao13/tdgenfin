import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSAO_KEY } from '../decorators/requer-permissao.decorator';
import { UsuarioPermissao } from '../../modules/usuarios/usuario-permissao.entity';
import { Role } from '../../modules/usuarios/usuario.entity';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(UsuarioPermissao)
    private readonly permissaoRepo: Repository<UsuarioPermissao>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissoesRequeridas = this.reflector.getAllAndOverride<string[]>(
      PERMISSAO_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permissoesRequeridas?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    // SUPER_ADMIN bypassa todas as permissões
    if (user.role === Role.SUPER_ADMIN) return true;

    // Verifica se o usuário tem TODAS as permissões requeridas
    for (const chave of permissoesRequeridas) {
      const permissao = await this.permissaoRepo.findOne({
        where: { usuarioId: user.id, chave, habilitado: true },
      });

      if (!permissao) {
        throw new ForbiddenException(
          `Permissão insuficiente: ${chave} não habilitada para este usuário`,
        );
      }
    }

    return true;
  }
}
