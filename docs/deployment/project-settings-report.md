# Supabase Project Settings Validation

## 1. Regional Configuration
- **Project Region**: Verify that the Supabase Project Region matches your Vercel/Railway deployment regions (e.g., `us-east-1` or `eu-central-1`) to minimize latency.
- **Database Region**: Same as the Project Region.
- **Timezone**: Supabase Postgres uses UTC by default. Do not change this; let the Next.js frontend handle timezone conversions.

## 2. Network & SSL
- **SSL Configuration**: Supabase enforces SSL for all connections. Ensure Prisma connects using `sslmode=require` or relies on Supabase's default SSL enforcement via the connection string.
- **IPv4/IPv6**: Supabase is deprecating PgBouncer for Supavisor, which natively supports IPv6. If your backend (e.g. Vercel Edge, Railway) strictly requires IPv4, ensure you use the Supavisor pooler string (`port 6543`) with the correct flags or add-ons if requested by Supabase.

## 3. Database Maintenance & Monitoring
- **Automatic Backups**: Check the Supabase Dashboard -> Database -> Backups. Ensure daily backups are active.
- **PITR (Point-in-Time Recovery)**: Available on the Pro Plan. Highly recommended for production to recover from accidental deletions.
- **Database Size**: Monitor the database size. The free tier has a 500MB limit, Pro has 8GB included. Ensure a monitoring alert is set up.

## 4. Connection Pool Settings
- **Pooler**: Supavisor is the default.
- **Mode**: Use `Transaction` mode for Prisma to prevent connection exhaustion.
- **Connection Limits**: Ensure the maximum connections on Supavisor do not exceed the underlying Postgres connection limit (default is typically 500 for Supavisor and 60-90 for direct Postgres on small instances).

## 5. Edge Functions & Realtime
- **Realtime**: Disabled by default for all tables. Do not enable unless adding a feature (like live chat).
- **Edge Functions**: Currently unused in this architecture, but available for background tasks if NestJS is ever replaced.
- **Webhooks**: Can be used in the future to trigger Next.js On-Demand ISR based on Postgres row changes.
