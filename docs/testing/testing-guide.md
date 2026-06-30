# Testing Guide

This guide outlines the testing philosophy and execution steps for the IT Developer Portfolio backend.

## Test Types

We employ three layers of testing:

1. **Unit Tests (`*.spec.ts`)**: 
   - Focus on isolated service methods, mappers, and utility functions. 
   - Prisma interactions are strictly mocked using Jest.
   - Run via: `pnpm test`

2. **Integration Tests (`test/integration/*.spec.ts`)**: 
   - Focus on database-level behaviors that cannot be reliably mocked (e.g., Transactions, Soft Deletes, Prisma relations).
   - Require a running test database.
   - Run via: `pnpm test:integration`

3. **E2E Tests (`test/*.e2e-spec.ts`)**:
   - Focus on the full HTTP request lifecycle.
   - Bootstraps the entire NestJS application with Supertest.
   - Verifies routing, global guards, exception filters, formatting, and DTO validation.
   - Run via: `pnpm test:e2e`

## Test Environment Setup

1. Make sure Docker is running.
2. Start the test database:
   ```bash
   docker-compose up -d postgres-test
   ```
3. The testing environment loads variables from `.env.test`.

### Database Reset Lifecycle
In Integration and E2E tests, we use specific helper functions (`test/utils/database.util.ts`):
- `beforeAll`: Runs `prisma db push` to ensure the schema is applied.
- `beforeEach`: Truncates all tables using `TRUNCATE ... CASCADE` to provide a clean state.
- `afterAll`: Disconnects Prisma.

## CI/CD Pipeline
In our GitHub Actions pipeline, the Postgres service is spun up automatically, and the database is prepared using `prisma migrate deploy` before executing the test suites. Coverage is enforced using the boundaries defined in `package.json`.
