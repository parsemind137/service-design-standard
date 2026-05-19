# Compliance Criteria (SDS 1.1.0)

A project complies with SDS 1.1.0 if:

## Structure

- [ ] Mandatory levels Layer, Slice, Segment exist
- [ ] Shared Layer (shared or lib) exists as the second-to-last level
- [ ] Infrastructure Layer exists as the bottommost level (if external systems are used)
- [ ] When using Groups: hierarchy between groups is respected

## Imports & Dependencies

- [ ] Direct Call Chain: upper level imports only from lower levels, no cycles
- [ ] No imports between Slices within the same Layer
- [ ] No cross-slice shared code — shared code lives in the Shared Layer

## Public API

- [ ] Each folder has an index file as the export point (re-exports only)

## Shared Layer

- [ ] Shared layer uses Pseudo Clean: dependencies via parameters, no hidden imports or global state
- [ ] Inside Shared, at the level of slices and segments: no nested layers/slices/segments, only grouping by purpose

## Infrastructure Layer

- [ ] Infrastructure slices are named by integration target (e.g. `db/`, `cache/`, `queue/`), not by business entity
- [ ] Standard SDS nesting rules (Hierarchy, Direct Call Chain, Public API) are applied inside Infrastructure slices
- [ ] No imports between Infrastructure slices
