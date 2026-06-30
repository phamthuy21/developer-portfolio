# Phases

Detailed phase breakdown and completion criteria. Agents must strictly follow these phases and generate a phase report after completing each one.

## Phase 0: AI Development Foundation
- **Goal**: Establish the project structure, documentation, rules, skills, and workflows.
- **Criteria**: All `.agents`, `.workflows`, and `docs` are created and approved.

## Phase 1: Project Initialization & CI/CD
- **Goal**: Scaffold Next.js and NestJS applications, setup Docker, and GitHub Actions.
- **Criteria**: Applications build successfully, linters run, and CI/CD pipelines are verified.

## Phase 2: Database Schema
- **Goal**: Define Supabase PostgreSQL schema, migrations, and RLS policies.
- **Criteria**: Prisma schema is defined, Supabase project is configured, RLS is active.

## Phase 3: Backend Core API
- **Goal**: Implement REST endpoints in NestJS for Projects, Experience, and Blog.
- **Criteria**: Swagger docs are available, endpoints return correct data, tests pass.

## Phase 4: Frontend Core UI
- **Goal**: Build the public-facing Next.js application.
- **Criteria**: Home, About, Projects, and Blog pages are fully responsive, accessible, and connected to the backend.

## Phase 5: Authentication
- **Goal**: Implement secure login for the admin dashboard.
- **Criteria**: Login page works, JWT is securely stored, protected routes redirect properly.

## Phase 6: Admin Dashboard
- **Goal**: Build the UI for managing portfolio content.
- **Criteria**: CRUD operations for all entities work smoothly from the frontend UI.
