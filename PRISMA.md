# Prisma database workflow

Prisma owns the application schemas `portfolio_auth` and `saas_demo`. Neon’s managed
`neon_auth` schema is intentionally excluded from `prisma/schema.prisma`.

The schema was introspected from the existing Neon database. The first migration is a
baseline marker only; it must not recreate the existing tables. Future schema changes should
be reviewed as SQL before deployment.

## Commands

```bash
set -a && source .env.local && set +a
npm run db:generate
npm run db:pull
npm run db:migrate:deploy
```

`DATABASE_URL` is server-only. Do not expose it through a `NEXT_PUBLIC_*` variable or commit
`.env.local`.

Prisma Client is available from `lib/prisma.ts` and uses Neon’s serverless adapter. Keep all
Prisma imports in server-only code, route handlers, or server components.
