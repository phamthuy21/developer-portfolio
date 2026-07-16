# Prisma Production Migration Guide

1. Ensure `DIRECT_URL` and `DATABASE_URL` are set correctly.
2. Build the application dependencies.
3. Run migrations: `npx prisma migrate deploy`
4. Run Prisma generation: `npx prisma generate`
5. Seed initial data (idempotent): `npx ts-node prisma/seed.ts`
