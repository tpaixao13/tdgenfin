import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Usuario } from '../usuarios/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { ResetSenhaDto } from './dto/reset-senha.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AcaoAuditoria } from '../auditoria/auditoria-log.entity';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly auditoriaService: AuditoriaService,
    private readonly mailService: MailService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { email: dto.email, ativo: true },
    });

    if (!usuario) throw new UnauthorizedException('Credenciais inválidas');

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) throw new UnauthorizedException('Credenciais inválidas');

    await this.auditoriaService.registrar({
      usuarioId: usuario.id,
      empresaId: usuario.empresaId ?? undefined,
      acao: AcaoAuditoria.LOGIN,
      entidade: 'usuario',
      entidadeId: usuario.id,
      dadosDepois: { email: usuario.email, role: usuario.role },
      ipAddress,
    });

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
      empresaId: usuario.empresaId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        empresaId: usuario.empresaId,
      },
    };
  }

  async solicitarReset(dto: EsqueciSenhaDto, ipAddress?: string): Promise<void> {
    // Sempre retorna sem revelar se o e-mail existe
    const usuario = await this.usuarioRepo.findOne({
      where: { email: dto.email, ativo: true },
    });

    await this.auditoriaService.registrar({
      usuarioId: usuario?.id,
      empresaId: usuario?.empresaId ?? undefined,
      acao: AcaoAuditoria.SOLICITACAO_RESET_SENHA,
      entidade: 'usuario',
      entidadeId: usuario?.id,
      dadosDepois: { email: dto.email },
      ipAddress,
    });

    if (!usuario) return; // silencioso

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.usuarioRepo.update(usuario.id, {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: expiresAt,
    });

    await this.mailService.enviarResetSenha(usuario.email, usuario.nome, rawToken);
  }

  async resetarSenha(dto: ResetSenhaDto, ipAddress?: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    const usuario = await this.usuarioRepo.findOne({
      where: { resetTokenHash: tokenHash },
    });

    if (!usuario || !usuario.resetTokenExpiresAt) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    if (usuario.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const senhaHash = await bcrypt.hash(dto.novaSenha, 12);

    await this.usuarioRepo.update(usuario.id, {
      senhaHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    });

    await this.auditoriaService.registrar({
      usuarioId: usuario.id,
      empresaId: usuario.empresaId ?? undefined,
      acao: AcaoAuditoria.RESET_SENHA,
      entidade: 'usuario',
      entidadeId: usuario.id,
      dadosDepois: { email: usuario.email },
      ipAddress,
    });
  }
}
