-- Migration 004: Tabela de permissões individuais por usuário
-- Executar no servidor:
--   cd /var/www/corefinance
--   export $(grep -v '^#' backend/.env | xargs)
--   PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME -f backend/src/database/migrations/004_usuario_permissoes.sql

BEGIN;

-- Adiciona novo valor ao enum de auditoria (não pode ser dentro de transação no PG < 12)
-- Se der erro, execute este comando separadamente antes do BEGIN:
--   ALTER TYPE acao_auditoria ADD VALUE IF NOT EXISTS 'ALTERACAO_PERMISSAO';

-- Tabela de permissões por usuário
CREATE TABLE IF NOT EXISTS usuario_permissao (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID        NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  chave       VARCHAR(100) NOT NULL,
  habilitado  BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_usuario_permissao UNIQUE (usuario_id, chave)
);

CREATE INDEX IF NOT EXISTS idx_usuario_permissao_usuario
  ON usuario_permissao (usuario_id);

COMMIT;

-- Executar fora da transação (PG exige isso para ALTER TYPE ADD VALUE):
ALTER TYPE acao_auditoria ADD VALUE IF NOT EXISTS 'ALTERACAO_PERMISSAO';
