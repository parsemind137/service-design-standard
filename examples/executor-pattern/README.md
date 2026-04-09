# Executor Pattern

Structural pattern for organizing segments inside a Slice (SDS).

Closest analogues: **Application Service / Use Case** (Clean Architecture), **Transaction Script** (Fowler), partially **Facade** (GoF). Not a direct copy of any of them.

---

## Idea

A Slice is split into two mandatory segments:

- **`0_executor`** — orchestration: context, dependencies, scenario methods (use cases of the slice).
- **`1_lib`** — private library: pseudo-clean functions grouped by purpose (`api`, `ui`, `transformers`, `validators`, …).

The public API of the Slice exports only `executor`. The `lib` segment is **never** exported outside the Slice.

---

## Structure

```
slice/
├── index.js                    # Public API → only executor
├── 0_executor/
│   ├── index.js                # Re-export
│   └── executor.js             # Dependencies, context, scenario methods
└── 1_lib/
    ├── index.js                # Re-export all lib modules
    ├── api.js                  # Data access (fetch, save)
    ├── transformers.js         # Data transformations
    ├── validators.js           # Validation
    └── ui.js                   # Rendering
```

Both `0_executor` and `1_lib` allow arbitrary nesting depth inside (Free-form Inside Segment).

---

## Key Rules

**Dependencies (deps).** Defined explicitly in `executor.js` via direct imports from lower layers. This enforces Direct Call Chain statically — the caller cannot inject anything from a forbidden layer.

**Context (ctx).** Created inside `executor` via `extendCtx`. Extended through immutable snapshots (`Object.freeze` + spread), not mutation. Each scenario method may extend `ctx` with new fields; previous snapshots are not modified.

**lib functions.** Receive `ctx` as the first parameter. Use `ctx.deps.*` for infrastructure calls. Do not orchestrate — only perform a single focused task and return a result.

**Import direction.** `0_executor` → `1_lib` (top-down). `1_lib` never imports from `0_executor`.

---

## How It Maps to SDS

| SDS Concept              | Executor Pattern                                                |
| ------------------------ | --------------------------------------------------------------- |
| Segment                  | `0_executor` and `1_lib` are segments with fixed roles          |
| Segment Hierarchy        | `0_executor` (upper) → `1_lib` (lower)                          |
| Direct Call Chain        | Enforced by explicit imports in executor, not by deps injection |
| Public API               | `slice/index.js` re-exports only executor                       |
| Pseudo Clean             | Applied in `1_lib`; executor may use direct imports             |
| Free-form Inside Segment | Both segments allow internal folders                            |
| No Cross-Slice Shared    | `1_lib` is private to its Slice                                 |

---

## Context Lifecycle

```
createExecutor()
  ctx = { deps }                          # initial snapshot

executor.load(courseId)
  ctx = { deps, course, lastError }       # extended after fetch

executor.submit(formValues)
  ctx = { deps, course, draft, ... }      # extended after transform
  ctx = { deps, course, draft: null, ... } # extended after save
```

Each `extendCtx(ctx, patch)` creates a **new frozen object**. The previous snapshot is released to GC.

---

## Trade-offs

| Strength                                         | Weakness                                                                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| Scenario steps are readable in one place         | Executor grows with slice complexity — split into subfolders                  |
| lib is easy to unit-test (pure functions)        | Boundary "executor vs lib" can be ambiguous — needs team convention           |
| Static dependency analysis via imports           | Harder to mock deps in tests than with injection — use `jest.mock` or similar |
| ctx is immutable — safe from accidental mutation | Shallow freeze only — nested objects need discipline                          |
