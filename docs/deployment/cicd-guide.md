# CI/CD Pipeline Guide

## Automated Workflow
- **Lint:** `pnpm lint`
- **Typecheck:** `pnpm typecheck`
- **Build:** `pnpm build`
- **Database:** `npx prisma migrate deploy`

## Deployment Flow
1. Install dependencies `pnpm install`
2. Run database migrations.
3. Build backend and frontend.
4. Deploy artifacts.
5. Run smoke tests.
