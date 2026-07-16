# Rollback & Disaster Recovery

## Database Reversion
- Rely on Supabase Point-in-Time Recovery (PITR) or daily automated backups.
- Never use `migrate down` in production unless absolutely required and tested.

## Application Reversion
- Frontend: Redeploy previous successful build on Vercel/Netlify.
- Backend: Roll back Git commit tag and trigger CI/CD deploy.
