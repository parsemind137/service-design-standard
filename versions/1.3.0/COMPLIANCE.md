# Compliance Criteria (SDS 1.3.0)

A project complies with SDS 1.3.0 if:

## Structure

- [ ] Mandatory levels Layer, Slice, Segment exist
- [ ] Shared Layer (shared or lib) exists as the second-to-last level
- [ ] Infrastructure Layer exists as the bottommost level (if external systems are used)
- [ ] When using Groups: hierarchy between groups is respected

## Hierarchical Decomposition

- [ ] Each level is split by purpose and responsibility per Decomposition Steps: Layers by architectural responsibility, Slices by business entity (Shared Layer: code purpose; Infrastructure Layer: integration target), Segments by role within the Slice
- [ ] No element combines unrelated responsibilities: an element that remains complex is decomposed further (Groups, or further split inside a Segment)
- [ ] Each element is self-contained and understandable on its own, through its Public API
- [ ] Beyond the mandatory levels, a simple element is not split further

## Imports & Dependencies

- [ ] Direct Call Chain: upper level imports only from lower levels, no cycles
- [ ] No imports between Slices within the same Layer
- [ ] No cross-slice shared code — shared code between Slices is placed only in the designated bottommost Slice of that Layer or in the Shared Layer; no arbitrary Slice serves as a shared code source for peer Slices

## Public API

- [ ] Each folder has an index file as the export point (re-exports only)

## Shared Layer

- [ ] Inside Shared, at the level of slices and segments: no nested layers/slices/segments, only grouping by purpose

## Infrastructure Layer

- [ ] Infrastructure slices are named by integration target, not by business entity
- [ ] Standard SDS nesting rules (Hierarchy, Direct Call Chain, Public API) are applied inside Infrastructure slices
- [ ] No imports between Infrastructure slices

## Access Contour

- [ ] If a Layer serves multiple distinct caller types, its Slices are grouped into named Contour sub-folders
- [ ] No imports between Contours within the same Layer
- [ ] Layers below the Contour split remain unified across all Contours: logic common to all caller types is not duplicated

