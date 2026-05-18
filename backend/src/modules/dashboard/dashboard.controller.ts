import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../usuarios/usuario.entity';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  private resolveEmpresaId(user: { role: Role; empresaId: string }, header: string): string {
    if (user.role === Role.SUPER_ADMIN) {
      if (!header) throw new BadRequestException('Selecione uma empresa antes de continuar');
      return header;
    }
    return user.empresaId;
  }

  @Get('conta/:contaId')
  resumoConta(
    @Param('contaId', ParseUUIDPipe) contaId: string,
    @CurrentUser() user: { role: Role; empresaId: string },
    @Headers('x-empresa-id') header: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.dashboardService.resumoPorConta(
      contaId,
      this.resolveEmpresaId(user, header),
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
    );
  }

  @Get('empresa')
  resumoEmpresa(
    @CurrentUser() user: { role: Role; empresaId: string },
    @Headers('x-empresa-id') header: string,
  ) {
    return this.dashboardService.resumoPorEmpresa(this.resolveEmpresaId(user, header));
  }

  @Get('empresas')
  @Roles(Role.SUPER_ADMIN)
  resumoTodasEmpresas() {
    return this.dashboardService.resumoTodasEmpresas();
  }

  @Get('conta/:contaId/evolucao')
  evolucaoSaldo(
    @Param('contaId', ParseUUIDPipe) contaId: string,
    @CurrentUser() user: { role: Role; empresaId: string },
    @Headers('x-empresa-id') header: string,
    @Query('meses', new DefaultValuePipe(6), ParseIntPipe) meses: number,
  ) {
    return this.dashboardService.evolucaoSaldo(contaId, this.resolveEmpresaId(user, header), meses);
  }
}
