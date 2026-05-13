import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: config.get<number>('SMTP_PORT', 587),
      secure: config.get<string>('SMTP_SECURE', 'false') === 'true',
      auth: {
        user: config.get<string>('SMTP_USER'),
        pass: config.get<string>('SMTP_PASS'),
      },
    });
  }

  async enviarResetSenha(email: string, nome: string, token: string): Promise<void> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const link = `${frontendUrl}/reset-senha?token=${token}`;
    const from = this.config.get<string>('SMTP_FROM', 'noreply@corefinance.com.br');

    try {
      await this.transporter.sendMail({
        from,
        to: email,
        subject: 'Redefinição de senha — CoreFinance',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#0B2A4A">Redefinição de senha</h2>
            <p>Olá, <strong>${nome}</strong>.</p>
            <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para continuar:</p>
            <p style="margin:24px 0">
              <a href="${link}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
                Redefinir senha
              </a>
            </p>
            <p style="color:#6b7280;font-size:13px">
              O link expira em <strong>1 hora</strong>. Se você não solicitou, ignore este e-mail.
            </p>
            <p style="color:#6b7280;font-size:12px;margin-top:24px">
              Ou cole este link no navegador:<br/>
              <a href="${link}" style="color:#2563eb">${link}</a>
            </p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error(`Falha ao enviar e-mail de reset para ${email}: ${err.message}`);
      // Não re-throw: o fluxo deve retornar sucesso mesmo se o e-mail falhar (segurança)
    }
  }
}
