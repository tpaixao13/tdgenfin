import { Controller, Post, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { ResetSenhaDto } from './dto/reset-senha.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const ipAddress = req.ip ?? req.socket?.remoteAddress;
    return this.authService.login(dto, ipAddress);
  }

  @Post('esqueci-senha')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async esqueciSenha(@Body() dto: EsqueciSenhaDto, @Req() req: Request) {
    const ipAddress = req.ip ?? req.socket?.remoteAddress;
    await this.authService.solicitarReset(dto, ipAddress);
    return { message: 'Se o e-mail existir, você receberá as instruções de redefinição.' };
  }

  @Post('reset-senha')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async resetSenha(@Body() dto: ResetSenhaDto, @Req() req: Request) {
    const ipAddress = req.ip ?? req.socket?.remoteAddress;
    await this.authService.resetarSenha(dto, ipAddress);
    return { message: 'Senha redefinida com sucesso.' };
  }
}
