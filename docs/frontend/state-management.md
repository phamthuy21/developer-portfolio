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
- **Context API**: Used sparingly for global concerns (e.g., Auth Provider, Theme Provider).
