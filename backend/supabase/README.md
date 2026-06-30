# Supabase SQL Configuration

This directory contains SQL scripts for configuring Supabase features that Prisma does not manage.

## Deployment Order & Execution
These scripts must be executed manually in the **Supabase SQL Editor** after deploying the Prisma schema migrations.

1. **`storage.sql`**: Run this first. It creates the required storage buckets (`avatars`, `project-images`, `blog-images`, `certificates`, `resume`, `assets`) and configures their size limits, MIME restrictions, and public read policies.
2. **`rls.sql`**: Run this second. It enables Row Level Security (RLS) on all tables and creates public read policies for the portfolio content, as well as an anonymous insert policy for the `messages` table.

## Notes
Admin privileges are typically handled at the application layer via NestJS using either the Supabase `service_role` key or a standard privileged PostgreSQL connection pool, which naturally bypasses RLS for administrative mutations.
