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
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../usuarios/usuario.entity';
import { ContasReceberService } from './contas-receber.service';
import { CreateContaReceberDto } from './dto/create-conta-receber.dto';
import { UpdateContaReceberDto } from './dto/update-conta-receber.dto';

@Controller('contas-receber')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class ContasReceberController {
  constructor(private readonly service: ContasReceberService) {}

  @Post()
  @Roles(Role.ADMIN_EMPRESA)
  criar(
    @Body() dto: CreateContaReceberDto,
    @CurrentUser() user: { empresaId: string },
  ) {
    return this.service.criar(dto, user.empresaId);
  }

  @Get()
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
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContaReceberDto,
    @CurrentUser() user: { empresaId: string },
  ) {
    return this.service.atualizar(id, dto, user.empresaId);
  }
}
