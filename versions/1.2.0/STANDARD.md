# Service Design Standard (SDS)

**Version:** 1.2.0

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
- **Shared Code** — code shared within a structural level (Layer, Slice, or Segment), grouped by purpose. Recommended names: `shared` or `lib`.
- **Shared Layer** — Shared Code at the **Layer** level: the second-to-last layer, sitting above the Infrastructure Layer and below all domain layers.
- **Infrastructure Layer** — the bottommost level implementing technical adapters for external systems. Slices represent integration targets, not business entities.
- **Access Contour** — a named sub-folder within a Layer that groups Slices by caller type (e.g., `external/`, `internal/`). Contours within the same Layer are fully isolated: no imports between them are allowed. Layers below the Contour split remain unified across all Contours.

---

## Structure

### Level Hierarchy

Three mandatory nesting levels:

| Level       | Required | Grouping Option | Hierarchy Between Groups |
| ----------- | -------- | --------------- | ------------------------ |
| **Layer**   | ✓        | Layers Group    | mandatory                |
| **Slice**   | ✓        | Slices Group    | optional                 |
| **Segment** | ✓        | Segments Group  | mandatory                |

### Special Layers

Two reserved layer roles occupy the bottom of the layer hierarchy:

| Role                     | Position                            | Slice naming rule     | Internal structure rule          |
| ------------------------ | ----------------------------------- | --------------------- | -------------------------------- |
| **Shared Layer**         | second-to-last _(Layer level only)_ | by code purpose       | no nested layers/slices/segments |
| **Infrastructure Layer** | bottommost                          | by integration target | standard SDS rules apply         |

> Note: Shared Code also appears at Slice and Segment levels (as the bottommost element of that level). The "second-to-last" position rule is exclusive to the Layer level.

---

## Principles

### Necessary (Mandatory)

- **Service / Module Structure Principle** — internally adheres to Hierarchy, Direct Call Chain, Public API.
- **Hierarchy Principle** — mandatory in Layers and Segments. Structure and names are defined by the developer and domain. Lower layers serve upper ones. When using Groups, hierarchy is preserved. Upper depends on lower; lower does not know about upper.
- **Direct Call Chain Principle** — consequence of Hierarchy. Level 0 imports from all lower levels (1, 2, 3…). Level 1 does not import 0, but may import 2, 3… Imports only from below, no cycles.
- **Public API Principle** — each folder has an index file as the export point for all functionality. Re-exports only.
- **Slice / Slices Group Names** — Slice is a business unit within a layer. Name = entity name or entity group name, grouped by code purpose.
- **Shared Code Conception** — Shared Code (recommended names: `shared` or `lib`) can appear at any structural level:
  - as a **Layer** — second-to-last in the layer hierarchy (above Infrastructure Layer), shared project-wide;
  - as a **Slice** — bottommost slice within a Layer or Slices Group, shared within that layer;
  - as a **Segment** — bottommost segment within a Slice, shared within that slice.

  The **second-to-last position rule applies only at the Layer level**. At Slice and Segment levels, Shared Code is simply the bottommost element of that level. All Shared Code regardless of level: no nested layers/slices/segments inside — only grouping by purpose.

- **Infrastructure Layer Conception** — Infrastructure Layer is the bottommost level. Slices represent **integration targets** (external systems, technologies) rather than business entities. Standard SDS nesting rules (Hierarchy, Direct Call Chain, Public API) apply inside the Infrastructure Layer.
- **No Cross-Slice Shared Code** — code shared between Slices within a Layer must be placed in a designated shared position: the bottommost Slice within that Layer (per Shared Code Conception) or in the Shared Layer. No arbitrary Slice may serve as a shared code source for peer Slices.
- **No Imports Between Slices** — Slices at the same level are isolated; no imports between them.
- **Access Contour Principle** — when a Layer serves multiple distinct caller types, its Slices must be grouped into named Contour sub-folders. No imports between Contours within the same Layer. Layers below the Contour split remain unified across all Contours: logic common to all caller types is not duplicated.

### Useful (Recommended)

- **Numeric Hierarchy Levels** — for convenience, level numbering may be used; 0 is the top level.
- **Layers Group, Slices Group, Segments Group** — optional grouping of Layers, Slices, Segments. When using Groups — group-level index, re-exports only. Layers Group and Segments Group: hierarchy between groups is mandatory. Slices Group: hierarchy with other Slices Groups is optional.
- **KISS Beat DRY** — simplicity over reuse.
- **Layers And Segments** — structure and names are defined by the developer and domain.
- **Free-form Inside Segment** — Segment is a structural unit within a Slice. Inside a segment — arbitrary organization.
- **Cross-Entity Operations Contract** — when an operation involves multiple entities, a new dedicated Slice is introduced to represent the combined operation. It receives each entity's relevant data as needed and remains isolated from the individual entity Slices (cross-entity imports are forbidden by No Imports Between Slices).

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
├── 3_shared/                # Shared Layer (second-to-last)
│   ├── helpers/               # grouping by purpose, no nested layers/slices/segments
│   ├── enums/
│   ├── ...
│   └── index
└── 4_infrastructure/        # Infrastructure Layer (bottommost)
    ├── target-a/              # Slice = integration target
    │   ├── 0_segment/
    │   ├── 1_segment/
    │   └── index
    ├── target-b/              # Slice = integration target
    │   └── index
    └── index
```

**Layer hierarchy:** `0_layer-a` → `1_layer-b` → `2_layer-c` → `3_shared` → `4_infrastructure`.  
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
├── 3_shared/                   # Shared Layer (second-to-last)
│   ├── ...
│   └── index
└── 4_infrastructure/           # Infrastructure Layer (bottommost)
    ├── ...
    └── index
```

**Layer hierarchy:** `0_layer-a` → `1_layer-b` → `2_layer-c` → `3_shared` → `4_infrastructure`.  
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
├── 2_shared/                    # Shared Layer (second-to-last)
│   ├── ...
│   └── index
└── 3_infrastructure/            # Infrastructure Layer (bottommost)
    ├── ...
    └── index
```

**Layers Group hierarchy:** `0_layers-group-a` → `1_layers-group-b` (mandatory) → `2_shared` → `3_infrastructure`.  
**Slices Group hierarchy:** `0_slices_group` → `1_slices_group` (optional, if needed).  
**Segment hierarchy:** `0_segment` → `1_segment` → `2_segment`.

### Generic Example (with Access Contour)

Applicable when a Layer serves multiple distinct caller types. Layers below the Contour split remain unified across all Contours.

```
src/
├── 0_layer-a/                      # Layer 0 (no contour split)
│   └── index
├── 1_layer-b/                      # Layer 1 — split by Access Contour
│   ├── contour-a/                    # Contour A
│   │   ├── slice-x/
│   │   │   ├── 0_segment/
│   │   │   ├── 1_segment/
│   │   │   └── index
│   │   ├── slice-y/
│   │   │   └── index
│   │   └── index
│   ├── contour-b/                    # Contour B
│   │   ├── slice-x/
│   │   │   └── index
│   │   └── index
│   └── index
├── 2_layer-c/                      # Layer 2 — split by Access Contour
│   ├── contour-a/
│   │   ├── slice-x/
│   │   │   └── index
│   │   └── index
│   ├── contour-b/
│   │   ├── slice-x/
│   │   │   └── index
│   │   └── index
│   └── index
├── 3_layer-d/                      # Layer 3 — unified (shared across Contours)
│   ├── 0_slices_group/               # Slices Group: role A
│   │   ├── slice-x/
│   │   │   ├── 0_segment/
│   │   │   │   └── index
│   │   │   ├── 1_segment/
│   │   │   │   └── index
│   │   │   └── index
│   │   └── index
│   ├── 1_slices_group/               # Slices Group: role B
│   │   └── index
│   ├── 2_slices_group/               # Slices Group: role C
│   │   └── index
│   └── index
├── 4_shared/                       # Shared Layer (second-to-last)
│   └── index
└── 5_infrastructure/               # Infrastructure Layer (bottommost)
    ├── target-a/
    └── index
```

**Contour rule:** `contour-a/` and `contour-b/` within the same Layer cannot import from each other.  
**Unified layers:** both Contours in `1_layer-b` and `2_layer-c` call the same `3_layer-d` Slices — logic common to all caller types is not duplicated.  
**Slices Group hierarchy in `3_layer-d`:** `0_slices_group` → `1_slices_group` → `2_slices_group` (optional, defined by developer).
