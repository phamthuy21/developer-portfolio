# Backend Architecture (NestJS)

## 1. Modular Architecture
The backend is built with NestJS and follows a strict modular structure. Every major feature is encapsulated within its own module.

```
src/
├── app.module.ts
├── common/           # Shared guards, interceptors, decorators
├── config/           # Environment variables validation
├── modules/
│   ├── auth/         # JWT Authentication
│   ├── projects/     # Projects CRUD
│   ├── blog/         # Blog CRUD
│   ├── skills/       # Skills CRUD
│   └── experience/   # Experience CRUD
│   └── certificate/  # Certificate CRUD
└── prisma/           # Prisma service and schema
```

## 2. Domain-Driven Design (Simplified)
Each module contains:
- `*.controller.ts`: Handles HTTP routing and DTO validation.
- `*.service.ts`: Contains business logic.
- `*.dto.ts`: Data Transfer Objects (with `class-validator`).

## 3. Database Access
We use the Prisma ORM to interact with the Supabase PostgreSQL database. The Prisma Client is abstracted behind a `PrismaService` which is injected into feature services.

## 4. API Documentation
Swagger is integrated to automatically generate API documentation based on decorators in controllers and DTOs.
