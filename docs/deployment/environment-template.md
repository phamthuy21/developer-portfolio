# Environment Variables Template

This document outlines the required environment variables for the production environment.

## Backend (`backend/.env`)

```env
# Supabase PostgreSQL connection
DATABASE_URL="postgresql://[user]:[password]@[host]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://[user]:[password]@[host]:5432/postgres"

# Application Settings
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://your-portfolio-domain.com"

# Security & Authentication
JWT_SECRET="<generate-secure-random-string>"
JWT_REFRESH_SECRET="<generate-secure-random-string>"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=10
```

## Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="https://api.your-portfolio-domain.com/api/v1"
NEXT_PUBLIC_APP_NAME="IT Developer Portfolio"
NEXT_PUBLIC_APP_ENV="production"
```
