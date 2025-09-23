# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.1.1] - 2025-09-23

### Added

- Enabled nodes & options dragging functionality
- Added reset layout feature
- Added download SVG functionality for stories diagrams

### Changed

- Diagram settings are now enabled/disabled by toggle

### Fixed

- Improved nodes display in diagram
- Improved nodes tooltips visibility
- Minor diagram UI and style adjustments

## [0.1.0] - 2025-09-20

### Added

- Story Editor with node creation, deletion, and branching options.
- Story Player with example story and ability to load custom JSON stories.
- Import/export functionality for stories in JSON format.
- Story Diagram view using React Flow + Dagre for automatic layout.
- MIT License.
- Initial documentation in `README.md`.

### Changed

- Exported story JSON now orders `label` as the first field for clarity.

### Fixed

- Node label computation during import/export to ensure consistent numbering.
