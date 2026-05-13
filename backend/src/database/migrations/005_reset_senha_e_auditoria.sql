-- Migration 005: reset de senha + novos valores de auditoria

-- Colunas para o fluxo de reset de senha no usuário
ALTER TABLE usuario
  ADD COLUMN IF NOT EXISTS reset_token_hash  VARCHAR(64),
  ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP;

-- Novos valores do enum acao_auditoria
-- PostgreSQL não permite IF NOT EXISTS em ALTER TYPE, então usamos DO $$
DO $$ BEGIN
  ALTER TYPE acao_auditoria ADD VALUE IF NOT EXISTS 'SOLICITACAO_RESET_SENHA';
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE acao_auditoria ADD VALUE IF NOT EXISTS 'RESET_SENHA';
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE acao_auditoria ADD VALUE IF NOT EXISTS 'INATIVACAO_CONTA';
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE acao_auditoria ADD VALUE IF NOT EXISTS 'ATIVACAO_CONTA';
EXCEPTION WHEN duplicate_object THEN null;
END $$;
