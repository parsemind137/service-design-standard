# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-08-13

### Added

- **Access Contour Principle** (Necessary principle) — when a Layer serves multiple distinct caller types, its Slices must be grouped into named Contour sub-folders. No imports between Contours within the same Layer. Layers below the Contour split remain unified across all Contours — logic common to all caller types is not duplicated.
- **Access Contour** term added to Glossary.
- **Generic Example (with Access Contour)** added to illustrate Contour separation.
- Access Contour compliance criteria added to COMPLIANCE.md.

### Changed

- **Access Contour** (Glossary) — definition updated: removed "specialization of Slices Groups" framing (misleading because Contours are more restrictive than Slices Groups); now explicitly states that Contours are fully isolated with no imports between them.
- **No Cross-Slice Shared Code** — reworded to resolve contradiction with Shared Code Conception: shared code between Slices must occupy the designated bottommost Slice of that Layer or the Shared Layer; an arbitrary Slice may not serve as a shared code source for peer Slices.
- **Cross-Entity Operations Contract** — reworded: removed "via parameters" (was a reference to the removed Pseudo Clean concept); principle now focuses on introducing a dedicated Slice for the combined operation.

### Removed

- **Pseudo Clean** concept removed from Glossary and from the Shared Code Conception principle.

## [1.1.0] - 2026-05-19

### Added

- **Infrastructure Layer Conception** (Necessary principle) — Infrastructure Layer is now a formally defined layer: the bottommost level whose slices represent integration targets (external systems, technologies) rather than business entities. Standard SDS nesting rules apply inside it.
- **Infrastructure Layer** term added to Glossary with a precise definition.
- **Special Layers** section in Structure — table describing the two reserved layer roles (Shared and Infrastructure) with their position, slice naming rule, and internal structure rule.
- Infrastructure Layer shown explicitly in all three Generic Examples.
- Infrastructure Layer compliance criteria added to COMPLIANCE.md.

### Changed

- Layer hierarchy in all examples updated to include Infrastructure as the bottommost layer.

## [1.0.0] - 2025-03-11

### Added

- Initial release of Service Design Standard (SDS)
- Level hierarchy: Layer, Slice, Segment
- Mandatory principles: Service/Module Structure, Hierarchy, Direct Call Chain, Public API, Slice/Slices Group Names, Shared Code Conception, No Cross-Slice Shared Code, No Imports Between Slices
- Useful principles: Numeric Hierarchy Levels, Layers/Slices/Segments Group, KISS Beat DRY, Pseudo Clean Functions, Layers And Segments, Free-form Inside Segment, Cross-Entity Operations Contract
- Glossary of terms
- Structure table with grouping options
- Generic examples: without Groups, with Slices Group, with Layers and Slices Group
