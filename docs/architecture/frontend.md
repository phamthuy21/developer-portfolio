# Frontend Architecture (Next.js 15)

## 1. App Router
The project uses the Next.js 15 App Router (`app/` directory). We leverage React Server Components (RSC) to reduce client-side JavaScript. Only components that require interactivity (hooks, event listeners) should use `"use client"`.

## 2. Directory Structure
```
app/
├── (admin)/          # Admin dashboard routes
├── (public)/         # Public-facing routes (Home, About, etc.)
├── layout.tsx        # Root layout
components/
├── ui/               # Reusable dumb components (shadcn/ui)
├── features/         # Feature-specific components (e.g., BlogCard)
lib/                  # Utilities, hooks, and helpers
types/                # Global TypeScript definitions
```

## 3. Data Fetching
- **Server Components**: Fetch data directly in server components using Next.js extended `fetch` (with built-in caching/revalidation).
- **Client Components**: Use TanStack Query (React Query) for mutations and complex client-side fetching.

## 4. State Management
- Use local state and URL query parameters primarily.
- Complex forms use React Hook Form integrated with Zod for validation.
