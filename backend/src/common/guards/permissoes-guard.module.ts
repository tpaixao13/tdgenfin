import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioPermissao } from '../../modules/usuarios/usuario-permissao.entity';
import { PermissaoGuard } from './permissao.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioPermissao])],
  providers: [PermissaoGuard],
  exports: [PermissaoGuard],
})
export class PermissoesGuardModule {}
