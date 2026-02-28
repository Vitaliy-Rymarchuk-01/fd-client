---
trigger: always_on
description: Repository-wide Winsurf rules for fd-client (Feature-Based Architecture)
---

# fd-client Repository Rules (Feature-Based)

## 1. Comments
- Write comments only in English and only when they add non-obvious context (complex business logic, edge-case handling, reasoning that cannot be inferred from code).
- Prefer self-documenting code (clear naming, small pure functions, extracted helpers) over redundant comments.

## 2. TypeScript Discipline
- `strict` mode must remain enabled at all times.
- Avoid `any`, unsafe type assertions, or widening types. If unavoidable, document the reason in a short English comment.
- Model remote DTOs and domain entities explicitly using colocated `types/` inside each feature.
- Re-export reusable types via `index.ts` to avoid duplication and drift.

## 3. Architecture Philosophy
This project follows a **Feature-Based Architecture**.

- Features are vertical domain modules grouped by business capability.
- There is no Feature-Sliced Design (FSD) layering.
- Do not introduce artificial “layers” or cross-layer abstractions.
- Each feature owns its UI, API logic, hooks, and types.

Dependency direction:
- Features may depend on `shared/`
- Features must not implicitly couple to other features without explicit intent

## 4. API Layer
- All HTTP calls must go through a single Axios instance located in `shared/api`.
- Use minimal helpers (`api.get`, `api.post`, etc.).
- Do not use inline `try/catch` in features — error handling is delegated to TanStack Query.
- Keep request/response mappers colocated with the endpoint definition.
- Never return raw Axios responses outside the API layer.

## 5. Data Fetching & Side Effects
- Use TanStack Query for all server state.
  - Queries for reads
  - Mutations for writes
  - Invalidation for cache updates
- Derive loading and error states directly from TanStack Query hooks.
- Query keys and hook factories must live inside the feature that owns the data.

## 6. Forms & Validation
- All forms must use React Hook Form.
- Every form must have a colocated Zod schema.
- Integrate validation using `zodResolver`.
- Avoid duplicating form state with `useState` unless there is a justified performance need.

## 7. State Management
- Prefer composition over props drilling.
- Shared cross-feature state must use a dedicated Zustand store.
- Stores must expose typed selectors/hooks.
- Do not expose raw `set` references outside the store module.

## 8. UI & Styling
- Use Shadcn UI as the baseline component system.
- Extend variants via `cva` or equivalent — do not create ad-hoc styling forks.
- Centralize theme tokens inside `shared/ui`.
- Avoid global CSS overrides.

## 9. Tooling & Formatting
- Prettier must run before every commit.
- ESLint must pass without disabling rules.
- Import sorting must remain enabled.
- Do not bypass Git hooks that enforce formatting and linting.

## 10. Testing & Quality (Recommended)
- Test critical business logic (mappers, selectors, custom hooks) with Vitest.
- Prefer behavioral tests with Testing Library over snapshot-heavy testing.

# Feature-Based Folder Structure
```
src/
├── app/ # App shell, routing, global setup
├── providers/ # Global providers
├── pages/ # Route-level screens composed from features
├── features/ # Vertical domain modules
│ └── <feature>/
│ ├── components/ # Feature UI components
│ ├── hooks/ # Feature-specific hooks
│ ├── api/ # Query/mutation factories and mappers
│ ├── store/ # Feature-local Zustand store (if required)
│ ├── types/ # DTOs and domain types
│ └── index.ts # Public feature API
├── shared/ # Cross-cutting utilities, api base, ui primitives
├── assets/ # Static assets
└── main.tsx # Entry point
```