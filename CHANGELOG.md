# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-01-13

### Fixed

- **API Endpoint Corrections for Coolify v4.0.0-beta.454**:
  - Health check endpoint now uses `/health` instead of `/healthcheck`
  - Deploy application uses `/deploy?uuid=...` query parameter format
  - Database creation uses type-specific endpoints (`/databases/postgresql`, `/databases/mysql`, etc.)
  - Database lifecycle endpoints corrected (`/databases/{uuid}/start`, `/databases/{uuid}/stop`, `/databases/{uuid}/restart`)

- **422 Validation Errors Fixed**:
  - All `update_*` handlers no longer send UUID in request body (it's already in URL path)
  - `create_database` now correctly removes `type` from request body (used for routing only)
  - `create_application_env` and `update_application_env` no longer send UUID in body
  - `create_service_env` and `update_service_env` no longer send UUID in body
  - `update_github_app` no longer sends `github_app_id` in body

- **Improved Error Messages**:
  - API error responses now include detailed error messages and field-level validation errors
  - Better debugging experience when API calls fail

### Changed

- `create_database` tool: `name` parameter is now optional (Coolify auto-generates if not provided)
- Unavailable endpoints (`execute_command`, `get_service_logs`, `get_database_logs`) now return informative error messages instead of failing silently
- Official npm package name for this repository is `coolify-mcp-server-kof70`
- Installation and setup documentation now consistently uses `npx coolify-mcp-server-kof70 --setup`

## [1.2.0] - 2024-12-17

### Added

- **Confirmation Prompts for Dangerous Operations**: Set `COOLIFY_REQUIRE_CONFIRM=true`
  - Requires explicit `confirm: true` parameter for destructive actions
  - Affected operations: `stop_application`, `restart_application`, `stop_service`, `restart_service`, `deploy_application`, `execute_command`
  - Returns clear warning messages explaining the impact before execution
  - Provides example of how to confirm the operation

### Changed

- Tool definitions now include `confirm` parameter for dangerous operations
- Improved test coverage for confirmation feature

## [1.1.0] - 2024-12-17

### Added

- **Interactive Setup Wizard**: Run `npx coolify-mcp-server-kof70 --setup` for guided configuration
  - Auto-detects and configures Kiro, Cursor, VS Code, and Claude Desktop
  - Validates Coolify connection before saving config
  - Supports command-line arguments for automation
- **Read-Only Mode**: Set `COOLIFY_READONLY=true` for safe monitoring
  - Only exposes read operations (list, get, logs)
  - Blocks all write operations (create, start, stop, deploy)
- **Enhanced Logs Support**:
  - `get_service_logs` - Get logs from services
  - `get_database_logs` - Get logs from databases
- **Test Suite**: Comprehensive unit tests with Vitest
  - Tests for tool definitions, handlers, and client
  - Coverage reporting
- **CI/CD Pipeline**: GitHub Actions workflow
  - Automated testing on Node.js 18, 20, 22
  - Coverage reporting
  - Automatic npm publishing on version bump

### Changed

- CLI entry point now uses `cli.ts` with setup support
- Improved error messages for connection failures

## [1.0.0] - 2024-12-15

### Added

- Initial release
- Complete Coolify API coverage:
  - Version & Health checks
  - Teams management
  - Servers management (list, create, validate, resources, domains)
  - Projects & Environments management
  - Applications management (CRUD, start/stop/restart, deploy, logs, execute commands)
  - Services management (CRUD, start/stop/restart)
  - Databases management (PostgreSQL, MySQL, MongoDB, Redis)
  - Deployments tracking
  - Private Keys management
- MCP Resources support via `coolify://` URIs
- Automatic Coolify version detection
- Rate limiting with retry logic
- TypeScript support with full type definitions
- CLI binary (`coolify-mcp`)

### Security

- API tokens stored in environment variables only
- No hardcoded credentials
