import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissaoGuard } from '../../common/guards/permissao.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequerPermissao } from '../../common/decorators/requer-permissao.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../usuarios/usuario.entity';
import { ChavePermissao } from '../usuarios/usuario-permissao.entity';
import { ConciliacaoService } from './conciliacao.service';
import { ConciliacaoManualDto } from './dto/conciliacao-manual.dto';

@Controller('conciliacao')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConciliacaoController {
  constructor(private readonly conciliacaoService: ConciliacaoService) {}

  @Post('automatica/:contaId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_EMPRESA)
  @RequerPermissao(ChavePermissao.CONCILIACAO_EXECUTAR)
  @UseGuards(PermissaoGuard)
  executarAutomatica(
    @Param('contaId', ParseUUIDPipe) contaId: string,
    @CurrentUser() user: { id: string; role: Role; empresaId: string },
  ) {
    return this.conciliacaoService.executarAutomatica(contaId, user.empresaId, user.id);
  }

  @Post('manual/:contaId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_EMPRESA)
  @RequerPermissao(ChavePermissao.CONCILIACAO_EXECUTAR)
  @UseGuards(PermissaoGuard)
  executarManual(
    @Param('contaId', ParseUUIDPipe) contaId: string,
    @Body() dto: ConciliacaoManualDto,
    @CurrentUser() user: { id: string; role: Role; empresaId: string },
  ) {
    return this.conciliacaoService.executarManual(dto, contaId, user.empresaId, user.id);
  }

  @Delete('estornar/:conciliacaoId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_EMPRESA)
  estornar(
    @Param('conciliacaoId', ParseUUIDPipe) conciliacaoId: string,
    @CurrentUser() user: { id: string; role: Role; empresaId: string },
  ) {
    return this.conciliacaoService.estornar(conciliacaoId, user.empresaId, user.id);
  }

  @Get()
  listar(
    @CurrentUser() user: { role: Role; empresaId: string },
    @Query('contaId') contaId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit = 50,
  ) {
    return this.conciliacaoService.listar(user.empresaId, contaId, page, limit);
  }
}
