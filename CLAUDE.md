# CoreFinance — Instruções para o Claude

## Comportamento obrigatório

- Após qualquer alteração de código, **sempre commitar e fazer push automaticamente** sem precisar pedir
- Usar mensagens de commit descritivas em português seguindo o padrão `feat/fix/refactor: descrição`
- Nunca usar `git add .` ou `git add -A` — sempre adicionar arquivos específicos por nome

---

## Projeto

**CoreFinance** — Sistema financeiro SaaS multi-tenant full-stack.

- **Repositório:** https://github.com/tpaixao13/corefinance
- **Diretório:** C:\Users\tiago.paixao\Documents\Python\TDGenFin\ (renomear para CoreFinance)
- **Branch principal:** main

---

## Backend

- **Diretório:** backend/
- **Stack:** NestJS 11, TypeScript, PostgreSQL 16, TypeORM, JWT (passport-jwt), bcryptjs, multer, xlsx
- **Porta:** 3000
- **API prefix:** /api/v1
- **Iniciar:** `npm run start:dev` dentro de backend/

**Módulos implementados:**
- `auth` — login JWT, bcrypt, auditoria de login
- `empresas` — CRUD, SUPER_ADMIN only para criar/editar
- `usuarios` — CRUD, roles, multi-tenant
- `contas-bancarias` — CRUD, saldo recalculado via SQL
- `extratos` — importação OFX/CSV/XLSX, SHA256 dedup
- `conciliacao` — automática (±2 dias) + manual + estorno
- `dashboard` — resumo por conta e por empresa
- `auditoria` — log imutável de todas as ações sensíveis

**Multi-tenant:** Single DB + `empresa_id` em todas as tabelas. `TenantGuard` injeta `empresaId` do JWT. `SUPER_ADMIN` ignora filtro.

**Roles:** `SUPER_ADMIN`, `ADMIN_EMPRESA`, `USUARIO` — controlados via JWT payload + `RolesGuard`.

**Banco de dados:** PostgreSQL 16 local
- Banco: `tdgenfin` (local dev) / `corefinance` (produção VPS)
- Usuário: `postgres`
- Senha: `postgres`
- Executar SQL: `$env:PGPASSWORD="postgres"; & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d tdgenfin`
- Para hash bcrypt: `node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('senha', 12).then(h => console.log(h));"` dentro de backend/

**Credenciais de produção:**
- `admin@corefinance.com.br` — SUPER_ADMIN

---

## Frontend

- **Diretório:** frontend/
- **Stack:** React 19, TypeScript, Vite, TailwindCSS v4, Axios, TanStack React Query v5, React Router v7
- **Porta dev:** 5173
- **Iniciar:** `npm run dev` dentro de frontend/
- **Proxy:** /api → http://localhost:3000 (configurado no vite.config.ts)

**Telas implementadas:**
- `/` — Dashboard Financeiro Consolidado (filtro de período, resumo por conta, cards de indicadores)
- `/contas` — Contas Bancárias (listagem e gestão)
- `/importar` — Importar Extrato (drag-and-drop, OFX/CSV/XLSX)
- `/despesas` — Despesas com filtros por conta, período e status
- `/conciliacao` — Conciliação automática e manual
- `/usuarios` — Gestão de Usuários (SUPER_ADMIN + ADMIN_EMPRESA)
- `/empresas` — Gestão de Empresas (SUPER_ADMIN only)
- `/auditoria` — Log de auditoria com filtro e paginação
- `/login` — Split layout: logo à esquerda, form à direita

**Estrutura de pastas:**
```
frontend/src/
├── api/          — chamadas Axios por domínio (auth, empresa, contas, extratos, usuarios, auditoria, dashboard, conciliacao, despesas)
├── components/   — Sidebar, Header, Layout, CardSaldo, CardIndicador, FiltroPeriodo, ResumoPorConta, tabelas e forms modais
├── contexts/     — AuthContext (JWT + localStorage), EmpresaContext (auto-carrega empresa)
├── hooks/        — useAuth, useEmpresa, useUsuarios, useConciliacao, useDespesas, useDashboardFinanceiro
├── pages/        — uma página por rota
├── routes/       — PrivateRoute, PublicRoute, AppRoutes
└── types/        — index.ts com todos os tipos TypeScript centralizados
```

**Autenticação:** JWT em localStorage. Axios interceptor injeta `Authorization: Bearer` + `X-Empresa-Id` em cada request. 401 redireciona para /login.

**EmpresaContext:** ao logar, ADMIN_EMPRESA/USUARIO têm empresa setada automaticamente via `empresaId` do JWT. SUPER_ADMIN seleciona manualmente no Header e restaura do localStorage.

**Sidebar — visibilidade por role:**
- Todos: Dashboard, Contas, Importar Extrato, Despesas
- SUPER_ADMIN + ADMIN_EMPRESA: Conciliação, Usuários, Auditoria
- SUPER_ADMIN: Empresas

**Visual:**
- Cor principal: `#0B2A4A` (sidebar e painel esquerdo do login)
- Logo: `frontend/public/logo.png` (fundo branco, exibido em container branco arredondado)
- Favicon: `frontend/public/favicon.png`

## Segurança implementada (produção)

- Rate limiting: 5 tentativas/min no login (`@nestjs/throttler`)
- JWT_SECRET validado na inicialização (process.exit se fraco ou padrão)
- CORS_ORIGIN obrigatório em produção (process.exit se ausente)
- `synchronize: false` garantido para NODE_ENV=production e prod
