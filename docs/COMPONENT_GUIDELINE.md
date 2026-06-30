# Component Guidelines

This document defines the structure, props, state management, and reusability standards for React/Next.js components.

## 1. Component Structure
- Use functional components and React Server Components (RSC) by default.
- Add `"use client"` ONLY when interactivity (state, effects, event listeners) is required.
- Place components in feature-specific directories.
- Name files using `kebab-case.tsx`.

## 2. Props Definition
- Always define props using TypeScript `interface` or `type`.
- Export the props interface if it might be reused.
- Name the interface `[ComponentName]Props`.

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const Button = ({ variant = "primary", isLoading, children, ...props }: ButtonProps) => {
  // ...
};
```

## 3. State Management
- Prefer local state (`useState`, `useReducer`) for component-specific data.
- Use context providers sparingly, only for global states like theme or user session.
- Prefer URL query parameters for shareable state (e.g., active tab, search query, pagination).
- Use React Hook Form + Zod for form state and validation.

## 4. Reusability
- Use `shadcn/ui` components as the base for building the design system.
- Extract common logic into custom hooks (e.g., `use-debounce.ts`).
- Avoid deeply nested components. Use composition (passing `children`) to maintain flexibility.

## 5. Styling
- Use Tailwind CSS for all styling.
- Avoid inline styles.
- Use `cn()` utility (clsx + tailwind-merge) for conditionally joining class names.
