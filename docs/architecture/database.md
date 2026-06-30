# Database Architecture (Supabase)

## 1. Database Naming Conventions

### Database Tables
- `snake_case`
- Plural table names
- Examples: `users`, `projects`, `blog_posts`, `skills`, `experiences`, `certificates`, `messages`

### Prisma Models
- `PascalCase`
- Singular
- Examples: `User`, `Project`, `Blog`, `Skill`, `Experience`, `Certificate`, `Message`

### Columns
- `snake_case`
- Examples: `created_at`, `updated_at`, `github_url`, `image_url`

### Foreign Keys
- `entity_id`
- Examples: `project_id`, `skill_id`, `user_id`

### Enums
- Prisma: `PascalCase` (e.g., `ProjectStatus`)
- Database: `snake_case` (e.g., `project_status`)

### Index Naming
- Pattern: `idx_[table]_[column]`
- Examples: `idx_projects_slug`, `idx_messages_email`

### Constraint Naming
- Primary Key: `pk_[table]`
- Foreign Key: `fk_[table]_[ref]`
- Unique: `uq_[table]_[column]`
- Check: `ck_[table]_[column]`

## 2. Prisma Mapping Convention

- `@@map`: Used at the model level to map PascalCase model names to snake_case table names (e.g., `@@map("projects")`).
- `@map`: Used at the field level to map camelCase field names to snake_case column names (e.g., `@map("created_at")`).
- `@updatedAt`: Automatically updates the timestamp on record modification. Use for `updated_at`.
- `@default(now())`: Automatically sets the current timestamp on creation. Use for `created_at`.
- `@db.Uuid`: Enforces UUID type in PostgreSQL. Standard for all primary keys.
- `@db.VarChar(n)`: Enforces max length for strings (e.g., titles, emails).
- `@db.Text`: Used for unlimited length text fields (e.g., markdown content).

## 3. Relationship Convention

- **One-to-One (1:1)**: Used when a record in one table corresponds to exactly one record in another.
- **One-to-Many (1:N)**: Used when a record in one table corresponds to multiple records in another.
- **Many-to-Many (N:M)**: Must always use explicit junction tables. Do not rely on implicit relations. Example: `ProjectSkill` mapping `Project` and `Skill`.

## 4. Database Lifecycle

The lifecycle of a record follows this path:
`Create` -> `Update` -> `Soft Delete` (set `deleted_at`) -> `Restore` (clear `deleted_at`) -> `Permanent Delete`

## 5. Audit Fields & Soft Delete Strategy

- Every persistent entity must include:
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` (auto-updated)
- Entities that support soft deletion must include:
  - `deleted_at TIMESTAMPTZ NULL`
- Using `deleted_at` supports audit history, easier restoration, and is an industry standard compared to boolean flags.

## 6. Storage Design

Assets are hosted via Supabase Storage. The following buckets are recommended:

| Bucket Name      | Purpose                            | Access  | Max Size | Allowed MIME Types            | Naming Convention                        |
| ---------------- | ---------------------------------- | ------- | -------- | ----------------------------- | ---------------------------------------- |
| `avatars`        | User profile pictures              | Public  | 2MB      | `image/jpeg`, `image/png`     | `[user_id]/avatar.[ext]`                 |
| `project-images` | Screenshots and covers for projects| Public  | 5MB      | `image/jpeg`, `image/png`, `image/webp` | `[project_id]/[uuid].[ext]`              |
| `blog-images`    | Inline images for blog posts       | Public  | 5MB      | `image/jpeg`, `image/png`, `image/webp` | `[blog_id]/[uuid].[ext]`                 |
| `certificates`   | Images/PDFs of certificates        | Public  | 10MB     | `image/jpeg`, `image/png`, `application/pdf` | `[cert_id]/document.[ext]`               |
| `resume`         | Downloadable resume files          | Public  | 10MB     | `application/pdf`             | `[user_id]/resume.[ext]`                 |
| `assets`         | Generic site assets (logos, icons) | Public  | 2MB      | `image/svg+xml`, `image/png`  | `[uuid].[ext]`                           |

*(Note: No Supabase Storage configuration is implemented in this phase.)*

## 7. Row Level Security (RLS) Design

Policies applied at the database level:

- **Anonymous**: Can read from public tables (Projects, Blogs, Skills, Experiences, Certificates). Can insert into `messages`.
- **Public**: Broadest read-only access for non-sensitive entities.
- **Authenticated**: Standard logged-in user permissions.
- **Admin**: Full CRUD access across all tables, including private tables (like `messages`). Can read deleted/draft content.

*(Note: No RLS configuration is implemented in this phase.)*

## 8. Migration Convention

Migrations should be named with a sequential numerical prefix followed by a descriptive snake_case name:
- `0001_initial_schema`
- `0002_add_blog_table`
- `0003_add_project_skill_junction`

## 9. Index Strategy

Indexes should be explicitly defined for columns that are frequently used in `WHERE`, `ORDER BY`, or `JOIN` clauses.
- **Slugs** (`slug`): Indexed for fast exact match lookups (e.g., `idx_projects_slug`).
- **Emails** (`email`): Indexed for authentication and unique lookups.
- **Timestamps** (`created_at`): Indexed for chronological sorting.
- **Booleans/Enums** (`published`, `featured`): Indexed for filtering active content.

## 10. Constraint Strategy

- **Primary Key**: UUIDs enforced via `pk_[table]`.
- **Foreign Key**: Enforces relational integrity via `fk_[table]_[ref]`. Must define `ON DELETE` behavior.
- **Unique**: Enforces uniqueness (e.g., `uq_users_email`) for deterministic identification.
- **Check**: Validates domain logic at the DB level (e.g., `ck_messages_email` for regex format).
- **Not Null**: Used on all mandatory fields.
- **Default**: Used for timestamps, booleans, or standard fallback values.

## 11. Database Performance Guidelines

- **Index Best Practices**: Avoid over-indexing; only index high-cardinality or frequently queried columns.
- **Avoiding Duplicated Data**: Strive for 3NF (Third Normal Form).
- **Normalization Strategy**: Use junction tables for N:M relationships to prevent array field usage where relational integrity is needed.
- **Query Optimization**: Use `select` in Prisma to fetch only needed columns, especially avoiding heavy `Text` payloads when listing.
- **Expected Scalability**: Built to handle thousands of concurrent reads efficiently utilizing connection pooling.

---

## 12. Detailed Entity Definitions

### User (users)
- **Purpose**: Admin users managing the portfolio.
- **Soft Delete**: No.
- **Columns**:
  - `id` (UUID, PK, `pk_users`)
  - `email` (VarChar, Unique `uq_users_email`, Not Null, `idx_users_email`)
  - `password_hash` (VarChar, Not Null)
  - `full_name` (VarChar, Not Null)
  - `avatar_url` (VarChar, Nullable)
  - `created_at` (Timestamptz, Not Null, Default NOW())
  - `updated_at` (Timestamptz, Not Null, Auto-update)
- **Relationships**:
  - 1:N with `Project` (Author)
  - 1:N with `Blog` (Author)

### Project (projects)
- **Purpose**: Portfolio projects showcased on the site.
- **Soft Delete**: Yes (`deleted_at`).
- **Columns**:
  - `id` (UUID, PK, `pk_projects`)
  - `title` (VarChar, Not Null)
  - `slug` (VarChar, Unique `uq_projects_slug`, Not Null, `idx_projects_slug`)
  - `description` (Text, Not Null)
  - `content` (Text, Not Null)
  - `github_url` (VarChar, Nullable)
  - `live_url` (VarChar, Nullable)
  - `image_url` (VarChar, Nullable)
  - `featured` (Boolean, Not Null, Default false, `idx_projects_featured`)
  - `published` (Boolean, Not Null, Default false)
  - `user_id` (UUID, FK `fk_projects_users`, Not Null)
  - `created_at` (Timestamptz, Not Null, Default NOW())
  - `updated_at` (Timestamptz, Not Null, Auto-update)
  - `deleted_at` (Timestamptz, Nullable)
- **Relationships**:
  - N:1 with `User` (Author)
  - N:M with `Skill` (via `project_skills` junction)

### Blog (blogs)
- **Purpose**: Blog posts.
- **Soft Delete**: Yes (`deleted_at`).
- **Columns**:
  - `id` (UUID, PK, `pk_blogs`)
  - `title` (VarChar, Not Null)
  - `slug` (VarChar, Unique `uq_blogs_slug`, Not Null, `idx_blogs_slug`)
  - `excerpt` (Text, Not Null)
  - `content` (Text, Not Null)
  - `cover_image` (VarChar, Nullable)
  - `published` (Boolean, Not Null, Default false, `idx_blogs_published`)
  - `user_id` (UUID, FK `fk_blogs_users`, Not Null)
  - `created_at` (Timestamptz, Not Null, Default NOW(), `idx_blogs_created_at`)
  - `updated_at` (Timestamptz, Not Null, Auto-update)
  - `deleted_at` (Timestamptz, Nullable)
- **Relationships**:
  - N:1 with `User` (Author)

### Skill (skills)
- **Purpose**: Technical skills (e.g., React, Node.js).
- **Soft Delete**: No.
- **Columns**:
  - `id` (UUID, PK, `pk_skills`)
  - `name` (VarChar, Unique `uq_skills_name`, Not Null)
  - `slug` (VarChar, Unique `uq_skills_slug`, Not Null)
  - `icon_url` (VarChar, Nullable)
  - `category` (VarChar, Not Null)
  - `created_at` (Timestamptz, Not Null, Default NOW())
  - `updated_at` (Timestamptz, Not Null, Auto-update)
- **Relationships**:
  - N:M with `Project` (via `project_skills` junction)
  - N:M with `Experience` (via `experience_skills` junction)

### ProjectSkill (project_skills)
- **Purpose**: Explicit junction table for N:M relationship between Projects and Skills.
- **Soft Delete**: No.
- **Columns**:
  - `project_id` (UUID, FK `fk_project_skills_projects`, Not Null)
  - `skill_id` (UUID, FK `fk_project_skills_skills`, Not Null)
  - `assigned_at` (Timestamptz, Not Null, Default NOW())
- **Constraints**:
  - Composite PK on (`project_id`, `skill_id`) named `pk_project_skills`

### Experience (experiences)
- **Purpose**: Work history / Resume entries.
- **Soft Delete**: Yes (`deleted_at`).
- **Columns**:
  - `id` (UUID, PK, `pk_experiences`)
  - `company` (VarChar, Not Null)
  - `position` (VarChar, Not Null)
  - `location` (VarChar, Nullable)
  - `start_date` (Timestamptz, Not Null, `idx_experiences_start_date`)
  - `end_date` (Timestamptz, Nullable)
  - `current` (Boolean, Not Null, Default false)
  - `description` (Text, Not Null)
  - `created_at` (Timestamptz, Not Null, Default NOW())
  - `updated_at` (Timestamptz, Not Null, Auto-update)
  - `deleted_at` (Timestamptz, Nullable)
- **Relationships**:
  - N:M with `Skill` (via `experience_skills` junction)

### ExperienceSkill (experience_skills)
- **Purpose**: Explicit junction table for N:M relationship between Experiences and Skills.
- **Soft Delete**: No.
- **Columns**:
  - `experience_id` (UUID, FK `fk_experience_skills_experiences`, Not Null)
  - `skill_id` (UUID, FK `fk_experience_skills_skills`, Not Null)
  - `assigned_at` (Timestamptz, Not Null, Default NOW())
- **Constraints**:
  - Composite PK on (`experience_id`, `skill_id`) named `pk_experience_skills`

### Certificate (certificates)
- **Purpose**: Professional certifications.
- **Soft Delete**: No.
- **Columns**:
  - `id` (UUID, PK, `pk_certificates`)
  - `name` (VarChar, Not Null)
  - `issuer` (VarChar, Not Null)
  - `issue_date` (Timestamptz, Not Null)
  - `credential_url` (VarChar, Nullable)
  - `image_url` (VarChar, Nullable)
  - `created_at` (Timestamptz, Not Null, Default NOW())
  - `updated_at` (Timestamptz, Not Null, Auto-update)
- **Relationships**: None

### Message (messages)
- **Purpose**: Contact form submissions from visitors.
- **Soft Delete**: Yes (`deleted_at`).
- **Columns**:
  - `id` (UUID, PK, `pk_messages`)
  - `name` (VarChar, Not Null)
  - `email` (VarChar, Not Null)
  - `subject` (VarChar, Not Null)
  - `content` (Text, Not Null)
  - `is_read` (Boolean, Not Null, Default false, `idx_messages_is_read`)
  - `created_at` (Timestamptz, Not Null, Default NOW())
  - `updated_at` (Timestamptz, Not Null, Auto-update)
  - `deleted_at` (Timestamptz, Nullable)
- **Relationships**: None
