# Phase 4 Report: Authentication & Authorization Foundation

## Objective
Build a secure, production-ready authentication and authorization foundation, integrating with the existing Prisma schema and following the established NestJS architecture. The implementation specifically excludes any Portfolio business APIs.

## Objectives Completed
- [x] Evaluated and revised the authentication architecture to follow official NestJS Passport patterns (`LocalStrategy` / `LocalAuthGuard`).
- [x] Configured stateless JWT access tokens and stateful refresh tokens with database hashing (added `refreshTokenHash` to schema).
- [x] Implemented bcrypt password hashing via a dedicated `PasswordService` with configurable salt rounds.
- [x] Built the `AuthModule` containing strictly scoped endpoints: `/login`, `/refresh`, `/logout`, `/me`.
- [x] Established RBAC foundation via `RolesGuard`, `@Roles()`, `@Public()`, and `@CurrentUser()` decorators.
- [x] Documented standard API responses and Bearer authentication in Swagger.
- [x] Updated `docs/DECISIONS.md` with ADR 006 explaining the stateful refresh token and strategy design.

## Architecture Summaries

### Authentication Summary
Authentication follows standard Passport patterns:
`POST /login` routes through `LocalAuthGuard` -> `LocalStrategy` -> `AuthService.validateUser()`. Upon success, `AuthService.login()` issues tokens. 
Passwords are never exposed from the `UsersService`.

### Authorization & RBAC Summary
Authorization defaults to blocking unauthenticated access on specific routes. Endpoints must be explicitly marked `@Public()` or rely on `JwtAuthGuard`. The `RolesGuard` ensures that users possess the necessary role claims embedded in their JWT payload. 

### JWT & Refresh Token Summary
- **JWT Strategy:** Access tokens are short-lived and purely stateless. Payload contains `sub`, `email`, and `role`.
- **Refresh Token Strategy:** Stateful. Refresh tokens are hashed and persisted in the DB. On refresh, the plain token is verified against the hash, tokens are rotated, and the new hash is stored. Logout revokes the hash.

## Validation Results
- `pnpm run build`: **PASS**
- `pnpm run lint`: **PASS**

## Security Notes
- `ConfigService` handles all secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `BCRYPT_SALT_ROUNDS`).
- Password logic is encapsulated within `PasswordService`.
- Helmet and CORS policies configured in Phase 3 remain active.
- *Future Consideration*: Implement rate limiting for `/login` endpoint to prevent brute-force attacks.

## Known Limitations / Technical Debt
- The `UsersModule` currently only queries by email or ID. Creating new users (registration/seeding) is pending implementation.
- The default role assigned upon login is explicitly hardcoded to `Admin` as a placeholder, since the project requirements state "single administrator account managed manually." This should be updated when user seeding is finalized.

## Recommendations
- Implement admin user seeding in the database so that the login flow can be fully utilized.
- Configure Redis or a similar cache layer if refresh token validation DB trips become a bottleneck.

## Status
**READY FOR PHASE 5**
