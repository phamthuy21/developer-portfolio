# Coding Standards

This document establishes rules for TypeScript styling, naming conventions, error handling, and linting.

## 1. Naming Conventions
- **Variables / Functions**: `camelCase` (e.g., `fetchUserData`)
- **React Components / Interfaces / Types / Classes**: `PascalCase` (e.g., `UserProfile`, `UserCard`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
- **Files / Directories**: `kebab-case` (e.g., `user-profile.tsx`, `auth.service.ts`)

## 2. TypeScript Rules
- Avoid `any` at all costs. Use `unknown` if the type is truly dynamic, and use type narrowing.
- Enable `strict` mode in `tsconfig.json`.
- Do not use non-null assertions (`!`). Properly handle `null` and `undefined`.

## 3. Error Handling
- Use `try/catch` blocks for asynchronous operations.
- Backend (NestJS): Throw specific HTTP exceptions (e.g., `NotFoundException`).
- Frontend (Next.js): Handle errors gracefully with Error Boundaries and toast notifications. Do not crash the app.
- Never swallow errors. Always log them appropriately.

## 4. Linting and Formatting
- **Prettier**: Use Prettier for automatic code formatting. Follow standard project config.
- **ESLint**: Ensure ESLint passes before any commit. Fix warnings where possible.
- **Imports**: Group imports (React, external libraries, internal modules, styles). Avoid relative paths exceeding two levels; use path aliases (e.g., `@/components/`).

## 5. Comments and Documentation
- Document complex logic with inline comments explaining the "why", not the "what".
- Use JSDoc format `/** ... */` for public utility functions and shared components to enable IDE intellisense.
