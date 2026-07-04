# State Management

## Server State (TanStack Query)
We use `TanStack React Query v5` for all server state management.

### Query Keys
Query keys are centralized in `src/lib/react-query/query-keys.ts` to prevent typos and ensure cache invalidation works correctly.

### Separation of Concerns
1. **API Client (`api.ts`)**: Pure functions that use `axios` to make network requests. They return raw data.
2. **React Query Hooks (`queries.ts`)**: Custom hooks that wrap the API functions with `useQuery` or `useMutation`.

### Caching and Invalidation
Mutations that change data (create, update, delete, restore) must invalidate the relevant query keys in their `onSuccess` callback to ensure the UI stays synchronized with the backend.

## Form State (React Hook Form + Zod)
We use `react-hook-form` for managing complex form state, combined with `zod` for strict schema validation.

- **Schemas**: Defined in `features/{module}/schemas/{module}.schema.ts`.
- **Form Components**: Use `<FormProvider>` to inject form context, enabling nested components to access form state without prop drilling.

## Client State (Local Storage & Context)
- **Local Storage**: Wrapped via `src/lib/storage/` (e.g., `token.storage.ts`). Direct `localStorage.getItem` inside components is forbidden.
- **Context API**: Used sparingly for global concerns (e.g., Auth Provider, Theme Provider, Permission Provider).

## Authentication State & Interceptors
Authentication state is managed by the `AuthProvider` which decodes and stores the JWT payload upon successful login. 
- **Axios Interceptors**: We use a dual-interceptor pattern in `src/lib/api/client.ts`.
  - `auth.interceptor.ts`: Attaches the Bearer token and automatically handles 401 Unauthorized responses by pausing in-flight requests, refreshing the token against `/auth/refresh`, and retrying the queued requests (preventing infinite refresh loops). Refresh failures are wrapped in standard RFC 7807 `UnauthorizedError`s.
  - `error.interceptor.ts`: Formats all other Axios errors into structured, predictable application error classes (`ApiError`, `ForbiddenError`, etc.).
- **Route Protection**: Admin routes are protected at the layout level (`app/(admin)/layout.tsx`). The layout blocks rendering until `AuthProvider.isLoading` is false, guaranteeing that React Query hooks in child components do not inadvertently fire unauthorized requests during initial session hydration.
