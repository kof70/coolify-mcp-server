# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
