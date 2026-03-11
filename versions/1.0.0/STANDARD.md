# Service Design Standard (SDS)

**Version:** 1.0.0

---

## Glossary

- **Service / Module** — a self-contained unit solving a single domain task.
- **Hierarchy** — principle of directed dependencies: upper levels depend on lower ones, not vice versa.
- **Layer** — architectural level.
- **Slice** — business unit within a Layer, named after an entity or entity group.
- **Segment** — structural unit within a Slice.
- **Layers Group** — group of layers; optional, but when used, hierarchy between groups is mandatory.
- **Slices Group** — group of Slices within a Layer; optional, hierarchy between groups is optional when used.
- **Segments Group** — group of Segments within a Slice; optional, but when used, hierarchy between groups is mandatory.
- **Direct Call Chain** — import rule: each upper level imports only from lower levels.
- **Public API** — index file in a folder, exporting functionality via re-exports without business logic.
- **Shared Code** — the bottommost level (`shared` or `lib`) with shared code.
- **Pseudo Clean** — approach where dependencies are passed through parameters, without hidden imports and global state.

---

## Structure

### Level Hierarchy

Three mandatory nesting levels:

| Level       | Required | Grouping Option | Hierarchy Between Groups |
| ----------- | -------- | --------------- | ------------------------ |
| **Layer**   | ✓        | Layers Group    | mandatory                |
| **Slice**   | ✓        | Slices Group    | optional                 |
| **Segment** | ✓        | Segments Group  | mandatory                |

## Principles

### Necessary (Mandatory)

- **Service / Module Structure Principle** — internally adheres to Hierarchy, Direct Call Chain, Public API.
- **Hierarchy Principle** — mandatory in Layers and Segments. Structure and names are defined by the developer and domain. Lower layers serve upper ones. When using Groups, hierarchy is preserved. Upper depends on lower; lower does not know about upper.
- **Direct Call Chain Principle** — consequence of Hierarchy. Level 0 imports from all lower levels (1, 2, 3…). Level 1 does not import 0, but may import 2, 3… Imports only from below, no cycles.
- **Public API Principle** — each folder has an index file as the export point for all functionality. Re-exports only.
- **Slice / Slices Group Names** — Slice is a business unit within a layer. Name = entity name or entity group name, grouped by code purpose.
- **Shared Code Conception** — Shared Code is the bottommost level (recommended names: shared or lib). All code is Pseudo Clean (dependencies via parameters). Inside shared there are no nesting levels (layers/slices/segments), only grouping of functions by purpose.
- **No Cross-Slice Shared Code** — shared code at the Slice level is not allowed; it must be moved to the Shared Layer.
- **No Imports Between Slices** — Slices at the same level are isolated; no imports between them.

### Useful (Recommended)

- **Numeric Hierarchy Levels** — for convenience, level numbering may be used; 0 is the top level.
- **Layers Group, Slices Group, Segments Group** — optional grouping of Layers, Slices, Segments. When using Groups — group-level index, re-exports only. Layers Group and Segments Group: hierarchy between groups is mandatory. Slices Group: hierarchy with other Slices Groups is optional.
- **KISS Beat DRY** — simplicity over reuse.
- **Pseudo Clean Functions** — all dependencies passed through parameters. No hidden imports or global state. Applies to shared code.
- **Layers And Segments** — structure and names are defined by the developer and domain.
- **Free-form Inside Segment** — Segment is a structural unit within a Slice. Inside a segment — arbitrary organization.
- **Cross-Entity Operations Contract** — when an operation involves multiple entities, a new entity is created that receives only the needed fields via parameters, without importing other entities (which is already forbidden by the No Imports Between Slices principle).

---

## Examples

### Generic Example (without Layers and Slices Group)

```
src/
├── 0_layer-a/              # Layer 0
│   └── index
├── 1_layer-b/              # Layer 1
│   ├── slice-x/              # Slice (cannot import from slice-y)
│   │   ├── 0_segment/          # Segment (imports 1_segment and 2_segment)
│   │   │   ├── ...
│   │   │   ├── index
│   │   ├── 1_segment/          # Segment (imports 2_segment)
│   │   │   ├── ...
│   │   │   ├── index
│   │   ├── 2_segment/          # Segment (does not import upper segments)
│   │   │   ├── ...
│   │   │   ├── index
│   │   └── index
│   ├── slice-y/
│   ├── ...
│   └── index
├── 2_layer-c/
│   ├── slice-x/
│   ├── slice-y/
│   ├── ...
│   └── index
└── 3_shared/                # Shared Code
    ├── ...
    └── index
```

**Layer hierarchy:** `0_layer-a` → `1_layer-b` → `2_layer-c` → `3_shared`.  
**Segment hierarchy (by dependencies):** `0_segment` → `1_segment` → `2_segment` (`0_segment` may import both `1_segment` and `2_segment`).  
**Constraint:** imports between `slice-x` and `slice-y` are forbidden (No Imports Between Slices).

### Generic Example (with Slices Group)

```
src/
├── 0_layer-a/                  # Layer 0
│   └── index
├── 1_layer-b/                  # Layer 1
│   ├── 0_slices_group/         # Slices Group (hierarchy optional)
│   │   ├── slice-x/
│   │   │   ├── 0_segment/      # Segment (imports 1_segment and 2_segment)
│   │   │   ├── 1_segment/      # Segment (imports 2_segment)
│   │   │   ├── 2_segment/      # Segment (does not import upper segments)
│   │   │   └── index
│   │   ├── slice-y/
│   │   │   ├── 0_segment/
│   │   │   ├── 1_segment/
│   │   │   ├── 2_segment/
│   │   │   └── index
│   │   └── index
│   ├── 1_slices_group/
│   │   ├── slice-z/
│   │   │   ├── 0_segment/
│   │   │   ├── 1_segment/
│   │   │   ├── 2_segment/
│   │   │   └── index
│   │   └── index
│   └── index
├── 2_layer-c/
│   ├── 0_slices_group/
│   │   ├── slice-x/
│   │   └── index
│   ├── ...
│   └── index
└── 3_shared/                   # Shared Code
    ├── ...
    └── index
```

**Layer hierarchy:** `0_layer-a` → `1_layer-b` → `2_layer-c` → `3_shared`.  
**Slices Group hierarchy:** `0_slices_group` → `1_slices_group` (optional, if needed).  
**Segment hierarchy:** `0_segment` → `1_segment` → `2_segment`.

### Generic Example (with Layers and Slices Group)

```
src/
├── 0_layers-group-a/            # Layers Group (upper group)
│   ├── 0_layer-a/               # Layer 0
│   │   └── index
│   ├── 1_layer-b/               # Layer 1
│   │   ├── 0_slices_group/      # Slices Group (hierarchy optional)
│   │   │   ├── slice-x/
│   │   │   │   ├── 0_segment/   # Segment (imports 1_segment and 2_segment)
│   │   │   │   ├── 1_segment/   # Segment (imports 2_segment)
│   │   │   │   ├── 2_segment/   # Segment (does not import upper segments)
│   │   │   │   └── index
│   │   │   ├── slice-y/
│   │   │   │   ├── 0_segment/
│   │   │   │   ├── 1_segment/
│   │   │   │   ├── 2_segment/
│   │   │   │   └── index
│   │   │   └── index
│   │   ├── 1_slices_group/
│   │   │   ├── slice-z/
│   │   │   │   ├── 0_segment/
│   │   │   │   ├── 1_segment/
│   │   │   │   ├── 2_segment/
│   │   │   │   └── index
│   │   │   └── index
│   │   └── index
│   └── index
├── 1_layers-group-b/            # Layers Group (lower group)
│   ├── 2_layer-c/
│   │   ├── 0_slices_group/
│   │   │   ├── slice-x/
│   │   │   └── index
│   │   ├── ...
│   │   └── index
│   └── index
└── 2_shared/                    # Shared Code
    ├── ...
    └── index
```

**Layers Group hierarchy:** `0_layers-group-a` → `1_layers-group-b` (mandatory) → `2_shared`.  
**Slices Group hierarchy:** `0_slices_group` → `1_slices_group` (optional, if needed).  
**Segment hierarchy:** `0_segment` → `1_segment` → `2_segment`.
