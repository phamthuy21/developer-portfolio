# Architectural Decision Records (ADRs)

This document records the architectural decisions made for the IT Developer Portfolio project.

## ADR 001: PROJECT.md as the Single Source of Truth

**Date:** 2026-06-28

**Context:** 
As the project foundation is built primarily using AI-driven development, there is a need for a unified, canonical entry point that defines the project's identity, tech stack, architecture, and workflow. Without a central document, AI agents might diverge in architectural approaches or miss critical project constraints.

**Decision:**
We will use `PROJECT.md` as the single source of truth for the entire project. All AI agents must read this document first before undertaking any tasks. It will define the project overview, tech stack, out-of-scope features, coding philosophy, and the definitive AI development workflow.

**Consequences:**
- **Positive:** Ensures consistency across all AI agents and human developers. Prevents architectural drift and duplicate code. Enforces the definition of done.
- **Negative:** Requires active maintenance to ensure `PROJECT.md` remains up-to-date as the project evolves.

## ADR 002: Workspace and Tooling Selections (Phase 1)

**Date:** 2026-06-28

**Context:**
During Phase 1, the physical workspace and dependencies needed to be initialized based on the defined architecture. We needed to choose a monorepo manager, a logger for NestJS, and configure code quality tools.

**Decision:**
- **Monorepo**: We chose `pnpm` workspaces combined with Turborepo (`turbo.json`) for efficient, caching-enabled task orchestration across the frontend and backend.
- **Backend Logging**: We selected `nestjs-pino` (and `pino-http`) over `winston` because `pino` offers highly performant, structured JSON logging which is ideal for modern production and containerized environments.
- **Code Quality**: Husky, lint-staged, and commitlint were configured to enforce conventional commits and automatic linting/formatting on pre-commit.

**Consequences:**
- **Positive**: Strict, high-performance local environment and CI/CD foundations. Pino provides better observability.
- **Negative**: Turborepo adds a slight learning curve for running scripts globally versus locally in subdirectories.

## ADR 003: Database Conventions & Architecture Strategy (Phase 2A)

**Date:** 2026-06-28

**Context:**
Before implementing the database schema in Prisma and Supabase, strict conventions were needed to ensure consistency, security, and scalability. This included naming conventions, soft delete patterns, explicit relationship handling, and storage/RLS design.

**Decision:**
- **Naming Conventions**: Strict `snake_case` for database tables/columns and `PascalCase` for Prisma models. Indexes and constraints follow explicit prefixing (e.g., `idx_`, `pk_`).
- **Soft Deletes**: Standardized on `deleted_at TIMESTAMPTZ NULL` instead of boolean flags to better support audit history and standard Postgres tooling.
- **Relationships**: Mandatory use of explicit junction tables for many-to-many relationships (no implicit relations) to preserve data integrity and normalization.
- **Storage & RLS**: Defined granular buckets and row-level access patterns. RLS is enforced natively at the database level.

**Consequences:**
- **Positive**: Complete structural predictability, strict auditability, and no ambiguous "magic" behavior from ORM implicit relationships.
- **Negative**: Slightly more verbose Prisma schema definition due to explicit mapping (`@map` and `@@map`) and junction models.

## ADR 004: Database Implementation & Tooling Stability (Phase 2B)

**Date:** 2026-06-28

**Context:**
During the physical implementation of the database (Phase 2B), Prisma 7.8.0 was initially scaffolded. However, Prisma 7 introduced significant breaking changes (e.g., removing `datasource.url` in favor of Driver Adapters and `prisma.config.ts`), which caused compatibility issues with standard `ts-node` seeding and the current NestJS ecosystem without heavy reconfiguration. Additionally, local Docker-based execution on standard port 5432 conflicted with native PostgreSQL instances.

**Decision:**
- **Prisma Version:** Downgraded to Prisma 5 (`^5.22.0`) to maintain a stable, production-ready integration with NestJS without early-access features (Driver Adapters).
- **Seeding Constraint:** Seed data is strictly limited to reference tables (Skills, Certificates). Admin users and dynamic content generation are explicitly deferred to Phase 4 (Authentication).
- **Port Mapping:** Updated Docker PostgreSQL port mapping to `5433:5432` to avoid local host conflicts.

**Consequences:**
- **Positive:** Guaranteed stability and immediate compatibility with `@nestjs/passport` and standard backend ORM patterns. Seeding remains clean and avoids creating untracked authentication gaps.
- **Negative:** Forfeits new Prisma 7 features (like native edge acceleration configuration), which are not currently required for this portfolio architecture.

## ADR 005: Backend Foundation (Phase 3)

**Date:** 2026-06-28

**Context:**
Phase 3 established the global infrastructure and configuration layer for the NestJS backend. We required a robust strategy to handle configuration, logging, exceptions, and global validation, prior to implementing feature-specific business logic.

**Decision:**
- **Centralized Configuration:** Created typed configuration factories mapped via `@nestjs/config` and validated on boot using `class-validator` (via `env.validation.ts`).
- **Global Pipes & Filters:** Enforced `ValidationPipe` with `whitelist: true` and a global `HttpExceptionFilter` adhering to RFC 7807 (Problem Details for HTTP APIs).
- **Interceptors:** Implemented `LoggingInterceptor` via `nestjs-pino` for request/response logging, and `TransformInterceptor` to enforce a standard `data/meta` response payload.
- **Shared Architecture:** Scaffolded a `SharedModule` and empty `modules/*` layout for strict domain boundaries without generating any actual CRUD logic yet.

**Consequences:**
- **Positive:** Ensured a uniform standard for REST API errors, configuration loading, and observability (Pino). The system will strictly reject invalid environment states at boot time.
- **Negative:** Increased initial scaffolding complexity, though offset by standardizing future module development.

## ADR 006: Authentication & Authorization Architecture (Phase 4)

**Date:** 2026-06-28

**Context:**
Phase 4 focused on establishing a secure, production-ready Authentication and Authorization foundation. The design needed to strictly follow NestJS Passport patterns, remain extensible for future OAuth providers, and adopt secure stateful refresh token strategies.

**Decision:**
- **Authentication Flow:** Implemented using `LocalStrategy` via `LocalAuthGuard`. The logic explicitly delegates credential validation to `AuthService.validateUser()`, avoiding monolithic service design.
- **Stateful Refresh Tokens:** Transitioned to a stateful strategy. Refresh tokens are hashed using bcrypt and stored in the database (`refreshTokenHash`). On refresh, the token is validated against the stored hash and then rotated. Logout revokes the token hash from the database.
- **JWT Strategy:** Access tokens are kept minimal (`sub`, `email`, `role`) to prevent bloated payloads. Validated via `JwtStrategy` and `JwtAuthGuard`.
- **Role-Based Access Control (RBAC):** Established `RolesGuard`, `Roles` decorator, and a standard `Role` enum (Admin, User/Authenticated).
- **Password Security:** Bcrypt salt rounds are configured through `ConfigService` to prevent hardcoded secrets. Password hashes never leave the `UsersService`.

**Consequences:**
- **Positive:** Robust security posture, strictly adhering to enterprise Passport patterns. Stateful refresh tokens allow forced session revocation.
- **Negative:** Requires a database trip to validate refresh tokens, introducing a slight overhead during the refresh cycle compared to purely stateless tokens.
## ADR 007: Public API Design & Query Strategy (Phase 5)

**Date:** 2026-06-28

**Context:**
Phase 5 introduces the public, read-only REST APIs required by the frontend portfolio. It was necessary to define standards for pagination, querying, data exposure, and architecture separation without building full CRUD (Admin) capabilities.

**Decision:**
- **Architecture Strictness**: Controllers handle routing and Swagger only. Services contain business logic and Prisma calls. Mappers (`*.mapper.ts`) transform Prisma results into Response DTOs.
## ADR 007: Public API Design & Query Strategy (Phase 5)

**Date:** 2026-06-28

**Context:**
Phase 5 introduces the public, read-only REST APIs required by the frontend portfolio. It was necessary to define standards for pagination, querying, data exposure, and architecture separation without building full CRUD (Admin) capabilities.

**Decision:**
- **Architecture Strictness**: Controllers handle routing and Swagger only. Services contain business logic and Prisma calls. Mappers (`*.mapper.ts`) transform Prisma results into Response DTOs.
- **Explicit Prisma Selects**: All Prisma queries must use an explicit `select` object. Internal fields (e.g., `passwordHash`, `deletedAt`, unpublished metadata) are never fetched or exposed.
- **Pagination Strategy**: All paginated responses return a unified `meta` object containing `page`, `limit`, `total`, `totalPages`, `hasNext`, and `hasPrevious`.
- **Query Standard**: Search and filtering rely on standardized query parameters (`search`, `featured`, `skill`, `sort`, `order`).
- **Caching Strategy (Future Phase)**: Currently, no caching is implemented. Future iterations will rely on `Cache-Control` headers for CDN caching, `ETag` for client-side revalidation, and potentially a Redis store for optimizing heavy read-only endpoints.

**Consequences:**
- **Positive:** Guarantees zero leakage of sensitive data. Establishes a highly predictable and standardized contract for the frontend. Mappers ensure that entity structures are cleanly decoupled from public representations.
- **Negative:** Increased boilerplate (explicit selects, dedicated mapper classes) compared to returning raw Prisma entities.

## ADR 008: Admin CMS Architecture & Schema Adaptations (Phase 6)

**Date:** 2026-06-28

**Context:**
Phase 6 implements the authenticated Admin CMS APIs. The requirements dictated separating public and admin APIs while sharing services, employing Prisma transactions for multi-table operations, providing soft delete workflows across all domain models, and standardizing shared CRUD utilities. However, some initial models (`Skill`, `Certificate`, `Message`) lacked a `deleted_at` field.

**Decision:**
- **Admin Controllers:** Dedicated controllers (e.g., `admin-projects.controller.ts`) encapsulate all admin routes. They enforce authentication (`JwtAuthGuard`, `RolesGuard(Admin)`) at the controller level.
- **Shared Utilities:** Repetitive error handling, unique checks, and status assertions are centralized in `src/common/utils/prisma-crud.util.ts`.
- **Transactions:** Complex updates involving relations (e.g., updating a Project's skills) use Prisma `$transaction`.
- **Schema Update:** We added `deletedAt DateTime? @map("deleted_at") @db.Timestamptz()` to the `Skill`, `Certificate`, and `Message` models and migrated the database to support the unified soft-delete requirement without breaking the "no undocumented schema changes" constraint.

**Consequences:**
- **Positive:** Clear boundary between public and admin access control. Services remain DRY. Unified soft-delete strategy across the entire application.
- **Negative:** Schema had to be altered mid-project to support the uniform requirement. Maintaining two controllers per domain requires more files.
