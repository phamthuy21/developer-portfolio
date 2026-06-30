# Backend Test Matrix

## Unit Tests Coverage

| Module | Component | Methods Covered | Status |
|--------|-----------|-----------------|--------|
| Common | PrismaCrudUtil | `exists`, `throwIfNotFound`, `softDelete`, `restore` | ✅ Passing |
| Auth | AuthService | `validateUser`, `login`, `hashPassword` | ✅ Passing |
| Projects | ProjectsService | `findAll`, `findOneBySlug`, `create`, `update`, `remove` | ✅ Passing |
| Blogs | BlogsService | TBD | Pending |
| Skills | SkillsService | TBD | Pending |
| Experiences | ExperiencesService | `findAll`, `findAllAdmin`, `findOneAdmin`, `create`, `update`, `remove`, `restore` | ✅ Passing |
| Certificates | CertificatesService | `findAll`, `findAllAdmin`, `findOneAdmin`, `create`, `update`, `remove`, `restore` | ✅ Passing |
| Messages | MessagesService | `create`, `findAllAdmin`, `getUnreadCount`, `findOneAdmin`, `updateStatus`, `remove`, `restore` | ✅ Passing |

> Note: To minimize development time and redundancy in Phase 7, unit tests focus heavily on core foundational blocks (Auth, Prisma CRUD wrapper, Projects logic), while E2E tests guarantee full integration coverage for the remaining CRUD endpoints using the unified `PrismaCrudUtil`.

---

## E2E Integration Coverage

| Controller | Endpoint | Methods Tested | Auth Required | Status |
|------------|----------|----------------|---------------|--------|
| App | `/api/v1/health` | GET | No | ✅ Passing |
| App | `/api/v1/docs-json` | GET | No | ✅ Passing |
| Auth | `/api/v1/auth/login` | POST | No | ✅ Passing |
| Projects | `/api/v1/projects` | GET | No | ✅ Passing |
| Projects | `/api/v1/projects/:slug` | GET | No | ✅ Passing |
| Admin Projects | `/api/v1/admin/projects` | GET, POST, PATCH, DELETE | Yes | ✅ Passing |
| Blogs | `/api/v1/blogs` | GET | No | ✅ Passing |
| Blogs | `/api/v1/blogs/:slug` | GET | No | ✅ Passing |
| Admin Blogs | `/api/v1/admin/blogs` | GET, POST, PATCH, DELETE | Yes | ✅ Passing |
| Skills | `/api/v1/skills` | GET | No | ✅ Passing |
| Skills | `/api/v1/skills/:slug` | GET | No | ✅ Passing |
| Admin Skills | `/api/v1/admin/skills` | GET, POST, PATCH, DELETE | Yes | ✅ Passing |
| Experiences | `/api/v1/experiences` | GET | No | ✅ Passing |
| Admin Experiences | `/api/v1/admin/experiences` | GET, POST, PATCH, DELETE | Yes | ✅ Passing |
| Certificates | `/api/v1/certificates` | GET | No | ✅ Passing |
| Admin Certificates | `/api/v1/admin/certificates` | GET, POST, PATCH, DELETE | Yes | ✅ Passing |
| Messages | `/api/v1/messages` | POST | No | ✅ Passing |
| Admin Messages | `/api/v1/admin/messages` | GET, DELETE | Yes | ✅ Passing |
| Admin Messages | `/api/v1/admin/messages/unread-count` | GET | Yes | ✅ Passing |

---

## CI/CD and Infrastructure

| Feature | Description | Status |
|---------|-------------|--------|
| Test Database | Managed via `dotenv-cli` and `prisma db push` in `beforeAll` hooks | ✅ Passing |
| CI Pipeline | Uses GitHub actions `.github/workflows/ci.yml` running Node.js 22 | ✅ Applied |
| CI Migrations | `pnpm prisma migrate deploy` executing against CI test Postgres container | ✅ Configured |
| Swagger Validation | Verification of JSON OpenAPI schema payload at E2E level | ✅ Passing |
