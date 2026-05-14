-- Adiciona limite de usuários por empresa
ALTER TABLE empresa ADD COLUMN IF NOT EXISTS max_usuarios INTEGER NOT NULL DEFAULT 5;

-- Novos valores no enum de auditoria
ALTER TYPE auditoria_log_acao_enum ADD VALUE IF NOT EXISTS 'ALTERACAO_LICENCA';
ALTER TYPE auditoria_log_acao_enum ADD VALUE IF NOT EXISTS 'TENTATIVA_LIMITE_USUARIOS';
