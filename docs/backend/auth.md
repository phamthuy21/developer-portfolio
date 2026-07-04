# Backend Authentication & Authorization

This document outlines the architecture of the authentication and authorization layer in the NestJS backend.

## Overview
The backend uses **Passport** with **JWT** (JSON Web Tokens) to secure API endpoints. The system implements a secure combination of short-lived, stateless access tokens and long-lived, stateful refresh tokens.

## Token Strategies

### 1. Access Tokens (Stateless)
- Managed via `JwtStrategy` (`src/modules/auth/strategies/jwt.strategy.ts`).
- **Lifespan:** Short (e.g., 15 minutes, configurable via `JWT_EXPIRES_IN`).
- **Payload:** Minimal claims: `sub` (User ID), `email`, and `role`.
- **Validation:** Cryptographically verified using `JWT_SECRET`. Expiration is strictly enforced (`ignoreExpiration: false`). No database lookup is required to validate an access token, ensuring high performance for protected routes.

### 2. Refresh Tokens (Stateful)
- Managed via `JwtRefreshStrategy` (`src/modules/auth/strategies/jwt-refresh.strategy.ts`).
- **Lifespan:** Long (e.g., 7 days, configurable via `JWT_REFRESH_EXPIRES_IN`).
- **Security:** Refresh tokens are never stored in plain text. A bcrypt hash of the token (`refreshTokenHash`) is saved to the `User` record in the database.
- **Rotation:** When a refresh token is used, it is validated against the stored hash. Upon success, a completely new pair of tokens (access and refresh) is generated, and the new refresh token hash is updated in the database.
- **Revocation:** During logout, the `refreshTokenHash` is set to `null` in the database, instantly invalidating any active sessions.

## Guards and Decorators

- `@UseGuards(LocalAuthGuard)`: Protects the `/login` endpoint. Extracts email/password and passes them to `AuthService.validateUser()`.
- `@UseGuards(JwtAuthGuard)`: The primary guard for protected routes. Validates the incoming Bearer token.
- `@Public()`: A custom decorator that bypasses `JwtAuthGuard` for specific routes that need to remain open.
- `@Roles(Role.Admin)` / `@UseGuards(RolesGuard)`: Enforces Role-Based Access Control (RBAC). Checks if the role embedded in the JWT payload matches the required roles for the endpoint.
- `@CurrentUser()`: A custom parameter decorator to inject the strongly-typed `JwtPayload` into the controller method.

## Password Security
All passwords and refresh tokens are hashed using bcrypt via the `PasswordService`. Salt rounds are configurable via `BCRYPT_SALT_ROUNDS` (default: 10). Plain-text passwords never leave the boundaries of `AuthService` and `PasswordService`.

## Error Handling
Authentication and authorization failures throw standard NestJS exceptions (`UnauthorizedException`, `ForbiddenException`), which are intercepted by the global `HttpExceptionFilter` and formatted according to **RFC 7807 Problem Details** for consistent client consumption.
