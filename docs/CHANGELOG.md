# Changelog

All notable changes to this project will be documented in this file.

## [0.1.5] - 2025-10-25

### Added

- Download PNG functionality to Story Diagram.
- Browser local storage support.
- Reset progress/local storage functionality.
- Last saved indicator in Story Editor.
- Progress indicators in Story Player and Story Editor (optional during the story creation in Story Editor).
- Back button functionality for Story Player (optional during the story creation in Story Editor).

### Changed

- Made sidebar in Story Editor collapsible.
- Changed story progress handling logic.
- Updated the file upload button in Story Player with a custom one.

### Fixed

- Imported files can be correctly reuploaded after a reset.
- Minor styling adjustments.

## [0.1.4] - 2025-10-12

### Added

- Additional icons.
- Dynamic meta tags (+ additional tags).
- Local storage support for saving story state in Story Player (+ reset progress functionality).
- Mini map and color coding for the nodes in Story Diagram.

### Changed

- Refactored Nodes IDs (useMemo) in Story Editor and navigation buttons in Header to avoid duplication.
- Adjusted fit view for Story Diagram on mount only.
- Updated text rendering in Story Player to support multi-paragraph display.

### Fixed

- Improved Story Diagram readability and elements consistency.
- Minor styling fixes/adjustments throughout the components for responsiveness/accessibility.

## [0.1.3] - 2025-10-04

### Added

- Default metadata for JSON files on export.
- Filename sanitization for exports.
- File size and nodes length validation.

### Changed

- Adjusted editor's elements positions/dimensions.
- Refactored handleDownloadSvg to download the whole diagram.
- Enhanced exported files validation in case of missing links between nodes and options and imports validation to ensure start exists in nodes.
- Adjusted story diagram controls display.
- Refactored handleOverlayClick to check for dragState before closing the modal.

### Fixed

- Adjusted tooltip position handling on scroll/resize in CustomNode.
- Improved export functionality to ensure React Flow viewport is found and filter out controls.

## [0.1.2] - 2025-09-29

### Added

- Docs directory with Changelog and Roadmap.
- Type check for files upload.
- JSON validation.
- Undo functionality for deleted nodes/options (toast notifications with "Undo" button).

### Changed

- Accessibility adjustment (aria-labels/names for buttons).
- Metadata correction.

### Fixed

- Minor styling adjustments for responsiveness of the options fields.

## [0.1.1] - 2025-09-23

### Added

- Nodes & options dragging functionality.
- Reset layout feature.
- Download SVG functionality for stories diagrams.

### Changed

- Diagram settings are now enabled/disabled by toggle.
- Replaced alerts with toast notifications (Sonner).

### Fixed

- Improved nodes display in diagram.
- Improved nodes tooltips visibility.
- Minor diagram UI and style adjustments.

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
