# Database Security Audit Report

## 1. Database Roles & Permissions
- **Postgres User (postgres)**: The default superuser. Should only be used for administrative dashboard tasks, not by the application.
- **Service Role**: Used by the NestJS backend (via Prisma). Has elevated privileges to bypass RLS (if configured as such) or perform full CRUD. Keep `DIRECT_URL` and `DATABASE_URL` strictly on the backend.
- **Anonymous Role (anon)**: Currently unused and should remain disabled/unauthorized. The Next.js frontend communicates with the NestJS backend, not directly with Supabase.
- **Authenticated Role**: If used for admin JWTs directly to Supabase, ensure it only has access to intended tables.

## 2. Vulnerability Prevention
- **SQL Injection**: Prevented globally across the NestJS backend as all database interactions are routed through the Prisma ORM, which automatically parameterizes all queries. Raw queries (`$queryRaw`) should be thoroughly audited if ever introduced.
- **Data Validation**: Enforced via Zod schemas and NestJS ValidationPipes before data reaches Prisma.

## 3. Row Level Security (RLS)
- **Status**: RLS can be enabled as a defense-in-depth measure. 
- **Policy**: If enabled, create a policy that explicitly grants access ONLY to the `service_role` (which Prisma uses). This guarantees that even if the `anon` key is leaked, no data can be queried directly from the Supabase REST API.

## 4. Extensions & Network
- **Extensions**: Only enable necessary Postgres extensions (e.g., `uuid-ossp`).
- **Database Permissions**: Do not grant `GRANT ALL` to public or anon roles.

## 5. Security Checklist
- [ ] RLS is enabled on all tables (`users`, `projects`, `blogs`, etc.).
- [ ] Policies restrict access to `service_role` only.
- [ ] Prisma solely uses parameterized queries.
- [ ] `anon` role has no `SELECT`, `INSERT`, `UPDATE`, or `DELETE` permissions on core tables.
