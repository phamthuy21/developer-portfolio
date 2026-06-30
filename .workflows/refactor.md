# Refactor Workflow

**Trigger:** When code needs optimization, cleanup, or architecture realignment.

## Steps
1. Read the existing code thoroughly.
2. Identify DRY violations and overly complex functions.
3. Extract shared logic into `lib/` or `components/ui/`.
4. Ensure tests still pass.
5. Do not change business logic, only structure.
