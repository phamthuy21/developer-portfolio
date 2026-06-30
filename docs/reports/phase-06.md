# Phase 06 - Admin CMS APIs

## Objective
Implement authenticated Admin CMS APIs. These APIs will be consumed by the future Admin Dashboard. Only authenticated administrators may access them.

## Accomplishments
- Implemented `AdminProjectsController` and updated `ProjectsService`
- Implemented `AdminBlogsController` and updated `BlogsService`
- Implemented `AdminSkillsController` and updated `SkillsService`
- Implemented `AdminExperiencesController` and updated `ExperiencesService`
- Implemented `AdminCertificatesController` and updated `CertificatesService`
- Implemented `AdminMessagesController` and updated `MessagesService`
- Centralized reusable logic using `PrismaCrudUtil` (soft deletes, restore, pagination)
- Applied `JwtAuthGuard` and `RolesGuard` with `@Roles(Role.Admin)` across all Admin Controllers.
- Refactored `schema.prisma` to include `deletedAt` for soft-delete functionality, and migrated the database.
- Ensured strong typing and Prisma `$transaction` compliance for multi-table updates (Skills relations).
- Added Admin API Documentation to `docs/api/endpoints.md`.
- Verified compilation with `pnpm build` and code standards via `pnpm lint`.

## Next Phase
Phase 07: Testing & CI/CD Pipeline Setup.
