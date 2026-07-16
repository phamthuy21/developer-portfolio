# Secrets & API Keys Audit

## 1. Audit Guidelines

**Never commit `.env` or `.env.production` files to version control.**
Ensure the `.gitignore` explicitly lists these files (already verified).

## 2. Required Production Secrets (Backend)

The NestJS backend running on Railway/Render requires the following Environment Variables:

### Database (Supabase)

- `DATABASE_URL`: The Supavisor Transaction Pooler URL (Port 6543). Use `?pgbouncer=true` if using PgBouncer, though Supavisor generally handles this automatically for Prisma.
- `DIRECT_URL`: The Direct Postgres URL (Port 5432). Required for `prisma migrate deploy`.

### Authentication (NestJS)

- `JWT_SECRET`: A 64+ character cryptographically secure random string. Must be unique to production.
- `JWT_EXPIRATION`: Set to an appropriate value (e.g., `1h` or `3600s`).

### Cross-Origin Resource Sharing (CORS)

- `FRONTEND_URL`: Set to the production Next.js domain (e.g., `https://myportfolio.com`) to lock down CORS.

## 3. Required Production Secrets (Frontend)

The Next.js frontend running on Vercel requires the following Environment Variables:

- `NEXT_PUBLIC_API_URL`: Points to the production NestJS backend (e.g., `https://api.myportfolio.com`).

## 4. Exposure Audit

- Ensure the backend configuration (`src/config/env.validation.ts`) validates the presence of all these variables before the server starts.
