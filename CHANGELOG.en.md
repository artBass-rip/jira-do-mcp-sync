# Changelog

All notable changes are documented here. The format follows Keep a Changelog and Semantic Versioning.

## [1.1.0] - 2026-07-29

### Changed

- Renamed the project and repository to TeamWork.
- Bound the web service to localhost by default and added optional HTTP Basic authentication.
- Restricted generated-document access to the runtime data directory.
- Hardened the container with a read-only root filesystem, dropped capabilities, `no-new-privileges`, and a healthcheck.
- Added behavioral tests for authentication, path confinement, and local comments.
- Validated stored Gateway PIDs before terminating a previous process.
- Moved the macOS Gateway lifecycle to `launchd`, independent of the launching terminal.
- Rejected direct Compose startup without an MCP token and supplied Docker Desktop credential-helper paths to launchd.

## [1.0.0] - 2026-07-29

### Added

- Docker MCP Gateway integration with profile-managed Atlassian OAuth.
- Scheduled Jira synchronization and configurable Markdown generation.
- Goal-first grouping with theme and sprint/backlog placement levels.
- Editor-style web viewer with outline, search, scroll tracking, and folding.
- Local task comments with inline display, side-panel management, and orphan cleanup.
- JSONL logging and in-app log viewer.
- English and Russian documentation.
- CodeQL, dependency review, npm audit, Dependabot, and repository security settings.
