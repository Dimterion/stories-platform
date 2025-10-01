# Changelog

All notable changes to this project will be documented in this file.

## [0.1.2] - 2025-09-29

### Added

- Docs directory with Changelog and Roadmap
- Type check for files upload
- JSON validation
- Undo functionality for deleted nodes/options (toast notifications with "Undo" button)

### Changed

- Accessibility adjustment (aria-labels/names for buttons)
- Metadata correction

### Fixed

- Minor styling adjustments for responsiveness of the options fields

## [0.1.1] - 2025-09-23

### Added

- Nodes & options dragging functionality
- Reset layout feature
- Download SVG functionality for stories diagrams

### Changed

- Diagram settings are now enabled/disabled by toggle
- Replaced alerts with toast notifications (Sonner)

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
