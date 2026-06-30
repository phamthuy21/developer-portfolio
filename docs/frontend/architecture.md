# Frontend Architecture

## Core Philosophy
The frontend follows a **Feature-Based Architecture**. Instead of grouping by file type (e.g., all hooks in `src/hooks`, all components in `src/components`), we group by domain feature. This promotes modularity, encapsulation, and scalability.

## Directory Structure
```
src/
  app/              # Next.js App Router
    (public)/       # Public portfolio pages
    (admin)/        # Authenticated Admin Dashboard pages
  features/         # Domain-specific modules
    admin/          # Admin-specific domains (projects, blogs, etc.)
    public/         # Public-specific domains
  components/       # Shared UI components
    common/         # Reusable generic components (Buttons, Modals, Tables)
    ui/             # shadcn/ui base components
  lib/              # Shared infrastructure
    api/            # Axios setup, interceptors, error handling
    react-query/    # QueryProvider, query keys
    storage/        # Local storage wrappers (token, theme)
  providers/        # Global React context providers
  hooks/            # Generic global hooks
  constants/        # Global constants (routes, config)
  types/            # Global Typescript interfaces (API responses)
  utils/            # Global utility functions (formatting)
```

## Feature Structure Standard
Every feature module inside `src/features/*/{module}` must contain:
- `api/`: API calls (`module.api.ts`) and React Query hooks (`module.queries.ts`)
- `components/`: Feature-specific React components (`ModuleList.tsx`, `ModuleForm.tsx`)
- `schemas/`: Zod validation schemas (`module.schema.ts`)
- `types/`: Typescript types for the domain (`index.ts`)
- `utils/`: Domain-specific utilities
- `constants/`: Domain-specific constants
- `index.ts`: Barrel export file

## Page Standard
Pages within `src/app/` should be strictly structural. They compose feature components and manage layout/headers, but should **never** contain complex business logic, data fetching logic, or form handling. Those responsibilities belong to the feature components.

## Public Architecture & Rendering Strategy

### 1. Rendering Strategy
The Public Portfolio follows a strict **Server Components First** approach:
- Default: All `app/(public)/**/*.tsx` are Server Components.
- Exception: Client Components (`"use client"`) are restricted strictly to interactive elements like forms, animations (Framer Motion), theme toggling, search, and client-side pagination.
- **Hydration**: React Query is primarily used to hydrate server-fetched initial data onto the client for seamless subsequent navigations and filters without immediate, redundant fetching.

### 2. Incremental Static Regeneration (ISR)
ISR is utilized to pre-render the pages statically and automatically rebuild them in the background without needing a full redeploy.
- **1 Hour Revalidation (3600s)**: Home, About, Experience, Certificates.
- **5 Minute Revalidation (300s)**: Projects List, Blogs List.
- **Dynamic ISR**: `/projects/[slug]` and `/blog/[slug]` utilize `generateStaticParams()` to pre-render known slugs at build time, while falling back to ISR for newly published posts.

### 3. Metadata & SEO Strategy
Every public page implements the Next.js `Metadata` API to support:
- Title, Description, Keywords.
- Canonical URLs.
- OpenGraph (OG) and Twitter Cards.

Dynamic pages implement `generateMetadata()` to pull specific titles/descriptions from backend data.

**Structured Data (JSON-LD):**
JSON-LD schemas are injected natively in the DOM to support structured search engine crawling. Core schemas include `Person`, `Organization`, `BlogPosting`, `CreativeWork` (Projects), and `BreadcrumbList`.

### 4. Design System & Accessibility
A distinct set of UI primitives exists under `src/components/public/` to prevent duplication:
- Layout: `Container`, `Section`, `PageHero`.
- Visual: `StatisticCard`, `AnimatedReveal`, `TechnologyBadge`.

**Feature States**: Each feature implements standard views for the core component (`*Loading`, `*Empty`, `*Error`) to handle data transitions consistently.
**Accessibility**: All components prioritize semantic HTML, ARIA labels, focus management, and keyboard navigation.
