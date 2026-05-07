// ── Auth ──────────────────────────────────────────────
export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  empresaId: string | null;
}

export type Role = 'SUPER_ADMIN' | 'ADMIN_EMPRESA' | 'USUARIO';

// ── Empresa ───────────────────────────────────────────
export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  ativo: boolean;
  createdAt: string;
}

// ── Conta Bancária ────────────────────────────────────
export interface ContaBancaria {
  id: string;
  empresaId: string;
  banco: string;
  agencia: string;
  numero: string;
  descricao: string | null;
  saldoInicial: number;
  saldoAtual: number;
  ativo: boolean;
}

// ── Extrato ───────────────────────────────────────────
export type FormatoExtrato = 'OFX' | 'CSV' | 'XLSX';

export interface ExtratoImportacao {
  id: string;
  empresaId: string;
  contaId: string;
  nomeArquivo: string;
  formato: FormatoExtrato;
  totalLancamentos: number;
  periodoInicio: string | null;
  periodoFim: string | null;
  dataImportacao: string;
}

// ── Dashboard ─────────────────────────────────────────
export interface ResumoContaPeriodo {
  contaId: string;
  banco: string;
  agencia: string;
  numero: string;
  saldoInicial: number;
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoCalculado: number;
  diferenca: number;
  totalConciliados: number;
  totalPendentes: number;
  totalNaoEncontrados: number;
}

export interface ResumoEmpresa {
  empresaId: string;
  totalContas: number;
  saldoTotal: number;
  totalEntradas: number;
  totalSaidas: number;
}

// ── Paginação ─────────────────────────────────────────
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Erros API ─────────────────────────────────────────
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
