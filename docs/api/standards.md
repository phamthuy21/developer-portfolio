# API Standards

This document defines the overarching REST API standards for the IT Developer Portfolio backend.

## Base Path
All endpoints fall under `/api/v1`.

## Authentication
Admin-only endpoints require a Bearer token (JWT) passed in the `Authorization` header:
`Authorization: Bearer <token>`

## HTTP Response Envelopes
Successful responses are wrapped in a standard JSON envelope to ensure predictable parsing on the client.

### Standard Response Structure
```json
{
  "data": { ... }
}
```

### Paginated Response Structure
```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Error Formats
Error responses adhere strictly to **RFC 7807 (Problem Details for HTTP APIs)** format.

```json
{
  "type": "https://httpstatuses.com/400",
  "title": "BadRequestException",
  "status": 400,
  "detail": "Invalid input provided.",
  "instance": "/api/v1/projects",
  "timestamp": "2026-06-28T15:00:00.000Z",
  "message": ["title must be a string", "description must be a string"]
}
```

## Pagination, Sorting, and Filtering
- **Pagination**: Use `page` (default 1) and `limit` (default 10) query parameters.
- **Sorting**: Use `sort` (e.g., `createdAt`) and `order` (e.g., `asc` or `desc`) query parameters.
- **Filtering**: Use explicit query parameters such as `search`, `featured`, and `skill` (for specific modules).

## HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `204 No Content`: Resource successfully deleted or modified without returning body.
- `400 Bad Request`: Validation failure or malformed request.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated, but lacking permission.
- `404 Not Found`: Resource not found.
- `409 Conflict`: Resource already exists (e.g., unique constraint violation).
- `500 Internal Server Error`: An unexpected error occurred.

## API Testing Standards
- Every newly created endpoint MUST have corresponding E2E test coverage in `test/e2e/*.e2e-spec.ts`.
- E2E tests must validate HTTP status codes, error payloads (RFC 7807), and standard JSON envelopes.
- Admin APIs must be explicitly tested for `401 Unauthorized` responses when no token is provided, and `403 Forbidden` if a non-admin token is provided.
