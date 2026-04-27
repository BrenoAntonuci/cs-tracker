# CS2 Tracker — Guia do Projeto

## Objetivo
Sistema híbrido para rastrear estatísticas de CS2 com amigos:
- **Sync automático** via Steam Web API (stats globais agregadas: K/D, vitórias, precisão)
- **Cadastro manual** de sessões/partidas (modo, mapa, kills, HS%, etc.)
- Dashboard com gráficos de evolução, por mapa, por arma e ranking entre amigos

> A Steam API **não** fornece histórico de partidas individuais — apenas stats totais agregadas. Por isso o modelo híbrido.

---

## Princípios de Desenvolvimento

Estas diretrizes se aplicam a **toda** implementação neste projeto, sem exceção.

### Qualidade de Código
- TypeScript estrito — sem `any`, sem `as unknown`, tipar tudo explicitamente
- Funções pequenas e com responsabilidade única
- Nomes descritivos — código que se explica sem comentários
- Sem lógica duplicada — abstrair antes de repetir pela segunda vez

### Componentização (Frontend)
- Todo elemento de UI reutilizável vira um componente em `components/ui/`
- Ícones SVG centralizados em `components/ui/icons.tsx`
- Modais genéricos (ex: `ConfirmModal`) em `components/ui/` com props configuráveis
- Componentes de feature (ex: `MatchCard`, `StatCard`) em suas subpastas de domínio
- Props explícitas e tipadas — nunca passar objetos genéricos sem tipo

### Segurança
- `STEAM_API_KEY` e `JWT_SECRET` **nunca** no frontend — apenas em variáveis de servidor
- JWT armazenado em cookie `httpOnly` — nunca em `localStorage`
- Todo input validado com Zod antes de tocar no banco
- CORS restrito ao `FRONTEND_URL` definido no env

### Estrutura Moderna
- Server Components por padrão no Next.js — `'use client'` só quando necessário (interatividade, hooks)
- Lógica de negócio no backend (Fastify) — frontend apenas consome e exibe
- Módulos do backend com separação clara: `routes` (HTTP) → `service` (lógica) → `prisma` (dados)
- Imagens de mapas em `public/maps/{de_nome}.png` — registrar em `src/lib/maps.ts`

### Boas Práticas Gerais
- Erros tratados com mensagens claras ao usuário — nunca expor stack trace
- Operações independentes executadas em paralelo (`Promise.allSettled`)
- Sem `console.log` em produção — usar o logger do Fastify no backend
- Commits pequenos e descritivos

---

## Stack Técnica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR/SSG, React Server Components |
| Estilo | TailwindCSS + shadcn/ui | Rápido, acessível, zero custo |
| Gráficos | Recharts | Simples, bonito, free |
| Backend | Node.js + Fastify + TypeScript | Performance, tipagem nativa |
| Validação | Zod | Schemas compartilhados front/back |
| Auth | JWT (httpOnly cookie) + Steam OpenID OAuth | Sem localStorage, seguro contra XSS |
| ORM | Prisma | Type-safe, migrations, ótima DX |
| Banco | PostgreSQL via Neon (free tier) | Serverless, integração nativa Vercel |
| Monorepo | Turborepo + pnpm | Padrão da indústria 2025 |

---

## Hospedagem Gratuita

| Serviço | Plataforma |
|---|---|
| Frontend | Vercel |
| Backend | Railway ou Render |
| PostgreSQL | Neon (neon.tech) |
| Steam API | Gratuita com chave própria |

---

## Estrutura do Monorepo

```
cs2-tracker/
├── apps/
│   ├── web/                        # Next.js 14
│   │   ├── app/
│   │   │   ├── (auth)/            # login
│   │   │   ├── dashboard/         # visão geral
│   │   │   ├── matches/           # histórico + cadastro
│   │   │   └── stats/             # gráficos detalhados
│   │   └── components/
│   └── api/                        # Fastify
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/          # JWT + Steam OAuth
│       │   │   ├── matches/       # CRUD de partidas
│       │   │   ├── stats/         # cálculos de métricas
│       │   │   └── steam/         # integração Steam API
│       │   ├── plugins/           # JWT, CORS, rate-limit, helmet
│       │   └── prisma/
│       └── tests/
└── packages/
    └── types/                      # tipos TypeScript compartilhados
```

---

## Comandos de Desenvolvimento

```bash
# Instalar dependências (na raiz)
pnpm install

# Rodar tudo (front + back) em paralelo
pnpm dev

# Somente frontend
pnpm --filter web dev

# Somente backend
pnpm --filter api dev

# Prisma: gerar client
pnpm --filter api prisma generate

# Prisma: rodar migrations
pnpm --filter api prisma migrate dev

# Build completo
pnpm build

# Lint
pnpm lint
```

---

## Variáveis de Ambiente

### apps/api/.env
```env
# Neon: pooler URL (porta 6543) para queries da aplicação
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require&pgbouncer=true
# Neon: conexão direta (porta 5432) para prisma migrate
DIRECT_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
STEAM_API_KEY=...                      # Steam Web API key (nunca expor ao cliente)
JWT_SECRET=...                         # Secret para assinar JWTs
STEAM_RETURN_URL=http://localhost:3001/auth/steam/callback
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### apps/web/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## APIs da Steam Utilizadas

- `ISteamUserStats/GetUserStatsForGame?appid=730` — stats agregadas do CS2
- `ISteamUser/GetPlayerSummaries` — perfil do jogador (nome, avatar, steamId)
- Autenticação via Steam OpenID 2.0

**Regras de segurança:**
- A `STEAM_API_KEY` **nunca** vai ao frontend
- Cooldown de 1h no sync Steam usando `SteamStats.lastSyncedAt` (sem Redis)

---

## Referências
- [Steam Web API Docs](https://developer.valvesoftware.com/wiki/Steam_Web_API)
- [Neon Console](https://console.neon.tech)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Conversa de planejamento original](https://claude.ai/share/7fc3d5a0-37e0-4aa0-bc5f-92b7c8f62856)
