# Frontend Components Standard

## Shadcn/ui
We use `shadcn/ui` for our base accessible components. These are located in `src/components/ui`. They should not be modified to contain business logic. They represent our core design system.

## Common Components
Located in `src/components/common`. These are complex, reusable components built by composing standard UI components.

- **DataTable**: A generic table component accepting data, columns, and an isLoading state.
- **DeleteDialog**: A standardized confirmation dialog for destructive actions.
- **Pagination**: Standardized UI for handling API pagination metadata.
- **SearchInput**: A debounced search input component used in list views.
- **StatusBadge**: A visual badge for representing data state (e.g. Published, Draft, Deleted).
- **PageContainer / PageHeader**: Structural wrappers to ensure padding and layout consistency across all admin pages.

## Feature Components
Located in `src/features/{module}/components`. These components are highly coupled to their domain and contain business logic, such as data fetching or form submission.
They should NOT be imported across feature boundaries.
