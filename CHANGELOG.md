# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
