# Create API Workflow

**Trigger:** When adding new endpoints to an existing NestJS module.

## Steps
1. Define the DTOs in `*.dto.ts` with `class-validator`.
2. Add the endpoint signature in `*.controller.ts` with Swagger decorators.
3. Implement the business logic in `*.service.ts` using Prisma.
4. Ensure appropriate exception handling (e.g., `NotFoundException`).
5. Update `docs/api/endpoints.md`.
