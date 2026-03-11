# Compliance Criteria (SDS 1.0.0)

A project complies with SDS 1.0.0 if:

## Structure

- [ ] Mandatory levels Layer, Slice, Segment exist
- [ ] Shared Code layer (shared or lib) exists as the bottommost level
- [ ] When using Groups: hierarchy between groups is respected

## Imports & Dependencies

- [ ] Direct Call Chain: upper level imports only from lower levels, no cycles
- [ ] No imports between Slices within the same Layer
- [ ] No cross-slice shared code — shared code lives in the Shared Layer

## Public API

- [ ] Each folder has an index file as the export point (re-exports only)

## Shared Code

- [ ] Shared layer uses Pseudo Clean: dependencies via parameters, no hidden imports or global state
