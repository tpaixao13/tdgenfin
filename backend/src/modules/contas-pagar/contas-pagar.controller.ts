import {
  Controller,
  Get,
  Post,
  Put,
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
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissaoGuard } from '../../common/guards/permissao.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequerPermissao } from '../../common/decorators/requer-permissao.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../usuarios/usuario.entity';
import { ChavePermissao } from '../usuarios/usuario-permissao.entity';
import { ContasPagarService } from './contas-pagar.service';
import { CreateContaPagarDto } from './dto/create-conta-pagar.dto';
import { UpdateContaPagarDto } from './dto/update-conta-pagar.dto';

@Controller('contas-pagar')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class ContasPagarController {
  constructor(private readonly service: ContasPagarService) {}

  @Post()
  @Roles(Role.ADMIN_EMPRESA)
  @RequerPermissao(ChavePermissao.CONTAS_PAGAR_EDIT)
  @UseGuards(PermissaoGuard)
  criar(
    @Body() dto: CreateContaPagarDto,
    @CurrentUser() user: { empresaId: string },
  ) {
    return this.service.criar(dto, user.empresaId);
  }

  @Get()
  @RequerPermissao(ChavePermissao.CONTAS_PAGAR_VIEW)
  @UseGuards(PermissaoGuard)
  listar(
    @CurrentUser() user: { empresaId: string },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.service.listar(user.empresaId, page, limit);
  }

  @Get(':id')
  buscar(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { empresaId: string },
  ) {
    return this.service.buscarPorId(id, user.empresaId);
  }

  @Put(':id')
  @Roles(Role.ADMIN_EMPRESA)
  @RequerPermissao(ChavePermissao.CONTAS_PAGAR_EDIT)
  @UseGuards(PermissaoGuard)
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContaPagarDto,
    @CurrentUser() user: { empresaId: string },
  ) {
    return this.service.atualizar(id, dto, user.empresaId);
  }
}
