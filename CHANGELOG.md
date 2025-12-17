# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- **Interactive Setup Wizard**: Run `npx coolify-mcp-server --setup` for guided configuration
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
