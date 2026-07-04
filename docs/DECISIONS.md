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

## ADR 009: Testing Strategy & Coverage (Phase 7)

**Date:** 2026-06-30

**Context:**
As the backend features matured, a standardized testing infrastructure was needed. We had to decide the boundary between Unit Tests and Integration/E2E tests, particularly how to handle Prisma database interactions without excessive mocking overhead.

**Decision:**
- **Unit Tests:** Placed alongside service files (`*.service.spec.ts`). We use `jest.mock` and a custom `MockPrismaService` type to bypass the complex `$transaction` types and mock database calls strictly. Focus is on mapping, errors, and validation logic.
- **Integration Tests:** Placed in `test/integration/`. We interact with a real PostgreSQL test database managed by `dotenv-cli` overriding `DATABASE_URL`. Data is truncated before each test. We specifically test Prisma functionality like Soft Deletes and Transactions here.
- **E2E Tests:** Placed in `test/`. Real HTTP calls via `supertest` hitting controllers. Includes testing Swagger documentation validation (`/api/v1/docs-json`).
- **CI/CD:** Configured `.github/workflows/ci.yml` to run a PostgreSQL service, perform `prisma migrate deploy`, and sequentially execute `test:cov`, `test:integration`, and `test:e2e` on every push.

**Consequences:**
- **Positive:** High confidence in production deployments. Prisma logic (which is hard to unit-test accurately) is thoroughly validated in integration/E2E tests.
- **Negative:** E2E and integration tests require a running database, meaning local test execution relies on Docker being active.


## ADR 010: Frontend Architecture (Phase 8)

**Date:** 2026-06-30

**Context:**
Phase 8 focused on building the Admin Dashboard for the portfolio. The project required a scalable, maintainable frontend architecture utilizing Next.js 15, React 19, and TanStack Query, adhering strictly to the API contracts developed in earlier backend phases.

**Decision:**
- **Feature-Based Architecture:** The frontend was organized into src/features/{module} containing api/, components/, schemas/, types/, and utils/. This isolated domain logic from global concerns.
- **React Query + Axios:** Server state is managed by React Query with centralized query keys. Axios is configured with an interceptor pattern to handle global JWT authentication and automatic refresh-token rotation.
- **App Router Separation:** Admin and Public routes are strictly separated using route groups: (app)/(admin) and (app)/(public). The (admin) layout handles strict unauthenticated redirects.
- **Standardized Forms:** All data manipulation relies on react-hook-form paired with zod schema validation to ensure type safety and standard error messages.

**Consequences:**
- **Positive:** Highly modular and predictable codebase. Excellent separation of concerns.
- **Negative:** Slightly more boilerplate required per feature (e.g. creating distinct query hooks, schemas, API client wrappers) compared to placing everything directly inside Next.js page components.

## ADR 011: Public Portfolio Architecture & Rendering Strategy (Phase 9)

**Date:** 2026-06-30

**Context:**
Phase 9 implemented the public-facing Portfolio website. To ensure maximum SEO, performance, and accessibility, an explicit rendering and UI architecture strategy was needed.

**Decision:**
- **Rendering Strategy:** Server Components are used by default (app/(public)/**/*.tsx). Client Components are restricted strictly to forms, interactive UI, and animations.
- **Incremental Static Regeneration (ISR):** Public pages avoid strictly client-side fetching. Base pages (Home, About) revalidate every hour, while content lists (Projects, Blogs) and dynamic detail pages use ISR with a 300-second revalidation period. Dynamic paths implement generateStaticParams.
- **Metadata & Structured Data:** Every public page utilizes the Next.js Metadata API and implements JSON-LD structured data (Person, Organization, BlogPosting, etc.) for optimal SEO.
- **Public Design System:** Core layout primitives (Container, Section, PageHero) and standardized Feature State Components (*Loading, *Empty, *Error) are introduced to avoid layout duplication and ensure consistent states.

**Consequences:**
- **Positive:** Highly optimized for search engines, high performance due to pre-rendering and ISR, and a robust, accessible UI component system.
- **Negative:** Requires deeper understanding of Next.js hydration and Server Component constraints when bridging server-fetched data to client-side interactivity (React Query).

## ADR 012: Environment-Driven CORS Policy (Hotfix)

**Date:** 2026-07-01

**Context:**
The frontend login page was blocked by the browser's CORS policy because the backend called `app.enableCors()` with no arguments, which defaults to `origin: '*'`. Modern browsers reject credentialed requests (`withCredentials: true`) when the server responds with a wildcard `Access-Control-Allow-Origin` header.

**Decision:**
- Replace `app.enableCors()` with an explicit CORS configuration object in `main.ts`.
- Expose `app.frontendUrl` from `app.config.ts`, sourced from the `FRONTEND_URL` environment variable (defaulting to `http://localhost:3000` for local development).
- Set `credentials: true`, an explicit `origin` (never `'*'`), and restrict `methods` and `allowedHeaders` to the minimum required by the API.
- Document `FRONTEND_URL` in `.env.example` so all future environments (staging, production) supply the correct value without code changes.

**Consequences:**
- **Positive:** Browser no longer blocks credentialed requests. The allowed origin is fully configurable per environment through a single environment variable.
- **Negative:** None. The change is additive and backwards-compatible; the default value covers existing local development workflows.

