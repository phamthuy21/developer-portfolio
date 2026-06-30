# Deploy Workflow

**Trigger:** When merging to main or pushing to production.

## Steps
1. Run local build checks.
2. Verify environment variables are documented.
3. Ensure Prisma migrations are up to date.
4. Trigger GitHub Actions.
5. Check Vercel/Railway logs for successful startup.
