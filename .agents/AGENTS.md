# IT Developer Portfolio - AI Agent Rules

## Project Identity
- **Project**: IT Developer Portfolio
- **Goal**: Build a premium, high-performance portfolio with Next.js 15, NestJS, and Supabase.
- **Single Source of Truth**: Always read `docs/PROJECT.md` before starting any work.

## Architecture Guidelines
- Respect the strict Frontend (Next.js) / Backend (NestJS) separation.
- Frontend uses Server Components by default; Client Components only when needed.
- Backend uses strict modules, controllers, and services with Prisma for DB access.
- Refer to `/docs/architecture/` for detailed structure.

## AI Workflow
1. Read `docs/PROJECT.md`.
2. Read `docs/PHASES.md` to understand current progress.
3. Use the appropriate skills in `.agents/skills/`.
4. Follow the workflows in `.workflows/`.
5. Write code respecting `docs/CODING_STANDARD.md`.
6. Generate a phase report upon completing a phase.
7. **STOP and wait for user CONFIRM before proceeding to the next phase.**

## Coding Philosophy
- No placeholder code. Write production-ready code.
- Clean Architecture, SOLID, DRY, and KISS.
- Strict TypeScript: no `any`, handle nulls properly.
- Accessibility and responsive design are mandatory.
