# Coolify MCP Server

[![npm version](https://badge.fury.io/js/coolify-mcp-server-kof70.svg)](https://www.npmjs.com/package/coolify-mcp-server-kof70)
[![CI](https://github.com/kof70/coolify-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/kof70/coolify-mcp-server/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/coolify-mcp-server-kof70.svg)](https://nodejs.org)

A Model Context Protocol (MCP) server for [Coolify](https://coolify.io) API integration. Control your self-hosted PaaS directly from Claude, Kiro, or any MCP-compatible AI assistant.

**Compatible with Coolify v4.0.0-beta.454+**
**Official npm package for this repository:** `coolify-mcp-server-kof70`

## 🚀 Features

- **Complete API Coverage**: Applications, Databases, Servers, Projects, Services, Teams, Deployments, Private Keys
- **MCP Resources**: Direct resource access via `coolify://` URIs
- **Version Detection**: Automatic feature compatibility based on Coolify version
- **Rate Limiting**: Built-in rate limit handling with retry logic
- **Minimal Dependencies**: Only axios and MCP SDK
- **TypeScript**: Full type safety

## 📦 Installation

### Quick Setup (Recommended)

Run the interactive setup wizard:

```bash
npx coolify-mcp-server-kof70 --setup
```

This will:
1. Ask for your Coolify URL and API token
2. Validate the connection
3. Configure your IDE automatically (Kiro, Cursor, VS Code, Claude Desktop)

### Quick Setup with Arguments

```bash
npx coolify-mcp-server-kof70 --setup --url https://coolify.example.com --token your-token --ide kiro
```

### Global Installation

```bash
npm install -g coolify-mcp-server-kof70
coolify-mcp --setup
```

### From Source

```bash
git clone https://github.com/kof70/coolify-mcp-server.git
cd coolify-mcp-server
npm install
npm run build
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `COOLIFY_BASE_URL` | Yes | Your Coolify instance URL (e.g., `https://coolify.example.com`) |
| `COOLIFY_TOKEN` | Yes | API token from Coolify |
| `COOLIFY_TEAM_ID` | No | Team ID for multi-team setups |
| `COOLIFY_READONLY` | No | Set to `true` for read-only mode (safe monitoring) |
| `COOLIFY_REQUIRE_CONFIRM` | No | Set to `true` to require confirmation for dangerous operations |

### 🔒 Read-Only Mode

For safe monitoring without risk of accidental changes, enable read-only mode:

```json
{
  "mcpServers": {
    "coolify": {
      "command": "coolify-mcp",
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify.com",
        "COOLIFY_TOKEN": "your-api-token",
        "COOLIFY_READONLY": "true"
      }
    }
  }
}
```

In read-only mode, only these operations are available:
- `get_*` - Get details of resources
- `list_*` - List resources
- `health_check` - Check API health

All write operations (`create_*`, `start_*`, `stop_*`, `restart_*`, `deploy_*`, `execute_command`) are disabled.

### ⚠️ Confirmation for Dangerous Operations

For extra safety, you can require confirmation before executing dangerous operations:

```json
{
  "mcpServers": {
    "coolify": {
      "command": "coolify-mcp",
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify.com",
        "COOLIFY_TOKEN": "your-api-token",
        "COOLIFY_REQUIRE_CONFIRM": "true"
      }
    }
  }
}
```

When enabled, these operations require explicit confirmation:
- `stop_application`, `restart_application`
- `stop_service`, `restart_service`
- `deploy_application`
- `execute_command`

Without `confirm: true`, these operations return a warning:
```json
{
  "confirmation_required": true,
  "action": "stop_application",
  "warning": "This will stop the application and make it unavailable until restarted.",
  "message": "This is a dangerous operation. To proceed, call again with confirm: true",
  "example": { "uuid": "abc123", "confirm": true }
}
```

To execute, call again with `confirm: true`:
```
stop_application({ uuid: "abc123", confirm: true })
```

### Getting an API Token

1. Go to your Coolify instance
2. Navigate to **Keys & Tokens** → **API tokens**
3. Create a new token with required permissions:
   - `read` - For listing resources
   - `write` - For creating/updating resources
   - `deploy` - For deployment operations

## 🔧 Usage

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "coolify": {
      "command": "coolify-mcp",
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify.com",
        "COOLIFY_TOKEN": "your-api-token"
      }
    }
  }
}
```

### With Kiro

Add to your `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "coolify": {
      "command": "coolify-mcp",
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify.com",
        "COOLIFY_TOKEN": "your-api-token"
      }
    }
  }
}
```

### From Source

```json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": ["/path/to/coolify-mcp-server/build/index.js"],
      "env": {
        "COOLIFY_BASE_URL": "https://your-coolify.com",
        "COOLIFY_TOKEN": "your-api-token"
      }
    }
  }
}
```

## 🛠️ Available Tools

### Version & Health
| Tool | Description |
|------|-------------|
| `get_version` | Get Coolify version information |
| `health_check` | Check API health status |

### Teams
| Tool | Description |
|------|-------------|
| `list_teams` | List all accessible teams |
| `get_team` | Get team details by ID |
| `get_current_team` | Get current team details |
| `get_current_team_members` | Get current team members |
| `get_team_members` | Get members of a specific team |

### Servers
| Tool | Description |
|------|-------------|
| `list_servers` | List all servers |
| `get_server` | Get server details by UUID |
| `create_server` | Create a new server |
| `update_server` | Update a server |
| `delete_server` | Delete a server |
| `validate_server` | Validate server connection |
| `get_server_resources` | Get server resource usage |
| `get_server_domains` | Get domains configured on a server |

### Projects & Environments
| Tool | Description |
|------|-------------|
| `list_projects` | List all projects |
| `get_project` | Get project details |
| `create_project` | Create a new project |
| `update_project` | Update a project |
| `delete_project` | Delete a project |
| `list_environments` | List environments in a project |
| `get_environment` | Get environment details |
| `create_environment` | Create a new environment |
| `delete_environment` | Delete an environment |

### Applications
| Tool | Description |
|------|-------------|
| `list_applications` | List all applications |
| `get_application` | Get application details |
| `create_application` | Create a new application |
| `create_public_application` | Create from a public Git repository |
| `create_private_github_app_application` | Create from private repo using GitHub App |
| `create_private_deploy_key_application` | Create from private repo using deploy key |
| `create_dockerfile_application` | Create from a Dockerfile |
| `create_dockerimage_application` | Create from a Docker image |
| `create_dockercompose_application` | Create from Docker Compose |
| `update_application` | Update an application |
| `delete_application` | Delete an application |
| `start_application` | Start an application |
| `stop_application` | Stop an application |
| `restart_application` | Restart an application |
| `deploy_application` | Deploy an application |
| `deploy` | Deploy resources by UUID or tag |
| `execute_command` | Execute command in container |
| `get_application_logs` | Get application logs |
| `get_application_deployments` | Get all deployments for an application |

### Application Environment Variables
| Tool | Description |
|------|-------------|
| `get_application_envs` | Get environment variables for an application |
| `create_application_env` | Create an environment variable |
| `update_application_env` | Update an environment variable |
| `delete_application_env` | Delete an environment variable |
| `update_application_envs_bulk` | Update multiple environment variables in bulk |

### Services
| Tool | Description |
|------|-------------|
| `list_services` | List all services |
| `get_service` | Get service details by UUID |
| `create_service` | Create a new service |
| `update_service` | Update a service |
| `delete_service` | Delete a service |
| `start_service` | Start a service |
| `stop_service` | Stop a service |
| `restart_service` | Restart a service |

### Service Environment Variables
| Tool | Description |
|------|-------------|
| `get_service_envs` | Get environment variables for a service |
| `create_service_env` | Create an environment variable |
| `update_service_env` | Update an environment variable |
| `delete_service_env` | Delete an environment variable |
| `update_service_envs_bulk` | Update multiple environment variables in bulk |

### Databases
| Tool | Description |
|------|-------------|
| `list_databases` | List all databases |
| `get_database` | Get database details by UUID |
| `create_database` | Create a new database (PostgreSQL, MySQL, MariaDB, MongoDB, Redis, ClickHouse, Dragonfly, KeyDB) |
| `update_database` | Update a database |
| `delete_database` | Delete a database |
| `start_database` | Start a database |
| `stop_database` | Stop a database |
| `restart_database` | Restart a database |
| `get_database_backups` | Get backup configurations for a database |
| `create_database_backup` | Create a backup configuration |

### Deployments
| Tool | Description |
|------|-------------|
| `list_deployments` | List all deployments |
| `get_deployment` | Get deployment details |
| `cancel_deployment` | Cancel a deployment in progress |

### Private Keys
| Tool | Description |
|------|-------------|
| `list_private_keys` | List all SSH private keys |
| `get_private_key` | Get a private key by UUID |
| `create_private_key` | Create a new SSH private key |
| `update_private_key` | Update a private key |
| `delete_private_key` | Delete a private key |

### GitHub Apps
| Tool | Description |
|------|-------------|
| `list_github_apps` | List all GitHub Apps configured in Coolify |
| `get_github_app` | Get GitHub App details by ID |
| `create_github_app` | Create a new GitHub App configuration |
| `update_github_app` | Update a GitHub App configuration |
| `delete_github_app` | Delete a GitHub App configuration |
| `get_github_app_repositories` | Get repositories accessible by a GitHub App |
| `get_github_app_repository_branches` | Get branches of a repository |

### Resources
| Tool | Description |
|------|-------------|
| `list_resources` | List all resources (applications, services, databases) |

## 📚 MCP Resources

Access data directly via MCP resources:

```
coolify://applications    - List all applications
coolify://databases       - List all databases
coolify://servers         - List all servers
coolify://projects        - List all projects
coolify://services        - List all services
coolify://teams           - List all teams
coolify://deployments     - List all deployments
coolify://private-keys    - List all private keys
```

## 💡 Example Prompts

Once configured, you can ask your AI assistant:

- "List all my Coolify applications"
- "Deploy the app with UUID abc123"
- "Show me the logs for my-app"
- "Create a new PostgreSQL database called mydb"
- "What servers do I have in Coolify?"
- "Restart the production application"

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Coolify](https://coolify.io) - The amazing self-hosted PaaS
- [Model Context Protocol](https://modelcontextprotocol.io) - The MCP specification
- All contributors who help improve this project

## 📮 Support

- 🐛 [Report a bug](https://github.com/kof70/coolify-mcp-server/issues)
- 💡 [Request a feature](https://github.com/kof70/coolify-mcp-server/issues)
- 💬 [Discussions](https://github.com/kof70/coolify-mcp-server/discussions)
