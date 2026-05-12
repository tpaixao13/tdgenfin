-- Módulo ERP: Contas a Pagar e Contas a Receber

CREATE TYPE recorrencia_conta AS ENUM ('NENHUMA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL');
CREATE TYPE status_conta_pagar AS ENUM ('ABERTA', 'PAGA', 'CANCELADA');
CREATE TYPE status_conta_receber AS ENUM ('ABERTA', 'RECEBIDA', 'CANCELADA');

CREATE TABLE conta_pagar (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id       UUID NOT NULL REFERENCES empresa(id),
  descricao        VARCHAR(300) NOT NULL,
  fornecedor       VARCHAR(200),
  valor            NUMERIC(15, 2) NOT NULL,
  data_vencimento  DATE NOT NULL,
  recorrencia      recorrencia_conta NOT NULL DEFAULT 'NENHUMA',
  status           status_conta_pagar NOT NULL DEFAULT 'ABERTA',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conta_pagar_empresa ON conta_pagar(empresa_id);
CREATE INDEX idx_conta_pagar_status  ON conta_pagar(empresa_id, status);

CREATE TABLE conta_receber (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id        UUID NOT NULL REFERENCES empresa(id),
  descricao         VARCHAR(300) NOT NULL,
  cliente           VARCHAR(200),
  valor             NUMERIC(15, 2) NOT NULL,
  data_recebimento  DATE NOT NULL,
  recorrencia       recorrencia_conta NOT NULL DEFAULT 'NENHUMA',
  status            status_conta_receber NOT NULL DEFAULT 'ABERTA',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conta_receber_empresa ON conta_receber(empresa_id);
CREATE INDEX idx_conta_receber_status  ON conta_receber(empresa_id, status);
