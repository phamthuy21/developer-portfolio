# API Endpoints

This document outlines the standard REST API contract exposed by the NestJS backend.

## Base URL
`/api/v1`

## Standard Endpoints

### Auth
- `POST /auth/login` (Admin login, returns JWT)
- `POST /auth/refresh` (Refresh JWT)
- `POST /auth/logout` (Logout)
- `GET /auth/me` (Get current user, requires JWT)

### Projects
- `GET /projects` (List projects, public, paginated)
- `GET /projects/:slug` (Get project by slug, public)

### Blogs
- `GET /blogs` (List posts, public, paginated)
- `GET /blogs/:slug` (Get post by slug, public)

### Skills
- `GET /skills` (List skills grouped by category, public)

### Experiences
- `GET /experiences` (List timeline experiences, public)

### Certificates
- `GET /certificates` (List certificates, public)

### Messages
- `POST /messages` (Submit contact message, public)

## Admin Endpoints (Require JWT & Admin Role)

### Projects
- `GET /admin/projects` (List all projects including unpublished/deleted)
- `GET /admin/projects/:id` (Get project by ID)
- `POST /admin/projects` (Create project)
- `PATCH /admin/projects/:id` (Update project)
- `DELETE /admin/projects/:id` (Soft delete project)
- `PATCH /admin/projects/:id/restore` (Restore project)
- `PATCH /admin/projects/:id/publish` (Publish project)
- `PATCH /admin/projects/:id/unpublish` (Unpublish project)
- `PATCH /admin/projects/:id/feature` (Feature project)
- `PATCH /admin/projects/:id/unfeature` (Unfeature project)

### Blogs
- `GET /admin/blogs` (List all blogs including unpublished/deleted)
- `GET /admin/blogs/:id` (Get blog by ID)
- `POST /admin/blogs` (Create blog)
- `PATCH /admin/blogs/:id` (Update blog)
- `DELETE /admin/blogs/:id` (Soft delete blog)
- `PATCH /admin/blogs/:id/restore` (Restore blog)
- `PATCH /admin/blogs/:id/publish` (Publish blog)
- `PATCH /admin/blogs/:id/unpublish` (Unpublish blog)

### Skills
- `GET /admin/skills` (List all skills flat)
- `GET /admin/skills/:id` (Get skill by ID)
- `POST /admin/skills` (Create skill)
- `PATCH /admin/skills/:id` (Update skill)
- `DELETE /admin/skills/:id` (Soft delete skill)
- `PATCH /admin/skills/:id/restore` (Restore skill)

### Experiences
- `GET /admin/experiences` (List all experiences)
- `GET /admin/experiences/:id` (Get experience by ID)
- `POST /admin/experiences` (Create experience)
- `PATCH /admin/experiences/:id` (Update experience)
- `DELETE /admin/experiences/:id` (Soft delete experience)
- `PATCH /admin/experiences/:id/restore` (Restore experience)

### Certificates
- `GET /admin/certificates` (List all certificates)
- `GET /admin/certificates/:id` (Get certificate by ID)
- `POST /admin/certificates` (Create certificate)
- `PATCH /admin/certificates/:id` (Update certificate)
- `DELETE /admin/certificates/:id` (Soft delete certificate)
- `PATCH /admin/certificates/:id/restore` (Restore certificate)

### Messages
- `GET /admin/messages` (List all messages)
- `GET /admin/messages/:id` (Get message by ID)
- `PATCH /admin/messages/:id/status` (Update message status)
- `DELETE /admin/messages/:id` (Soft delete message)
- `PATCH /admin/messages/:id/restore` (Restore message)

## Request/Response Standards
- Content-Type: `application/json`
- Error Responses follow RFC 7807 Problem Details.
- Pagination is handled via `page` and `limit` query parameters.
