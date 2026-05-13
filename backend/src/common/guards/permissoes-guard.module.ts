import { Module } from '@nestjs/common';
import { PermissaoGuard } from './permissao.guard';

@Module({
  providers: [PermissaoGuard],
  exports: [PermissaoGuard],
})
export class PermissoesGuardModule {}
