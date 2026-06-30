# Prisma Configuration & Workflows

## Workflows

Ensure you are in the `backend/` directory or run these commands via `pnpm` from the workspace root.

- **Generate Client**: `pnpm run prisma:generate`
  - Re-generates the `@prisma/client` based on the current `schema.prisma`.
- **Migrate Database**: `pnpm run prisma:migrate`
  - Creates and applies a new migration. Prompts for a migration name.
- **Seed Database**: `pnpm run prisma:seed`
  - Populates the database with stable reference data (Skills, Certificates).
- **Reset Database**: `pnpm run prisma:reset`
  - Drops the database, applies all migrations, and runs the seed.
- **Prisma Studio**: `pnpm run prisma:studio`
  - Starts a local web UI to view and edit database records.
- **Validate Schema**: `pnpm run prisma:validate`
  - Validates `schema.prisma` syntax and relation correctness.
- **Format Schema**: `pnpm run prisma:format`
  - Formats `schema.prisma`.
