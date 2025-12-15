# Coolify MCP Server

[![npm version](https://badge.fury.io/js/coolify-mcp-server.svg)](https://www.npmjs.com/package/coolify-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/coolify-mcp-server.svg)](https://nodejs.org)

A Model Context Protocol (MCP) server for [Coolify](https://coolify.io) API integration. Control your self-hosted PaaS directly from Claude, Kiro, or any MCP-compatible AI assistant.

## 🚀 Features

- **Complete API Coverage**: Applications, Databases, Servers, Projects, Services, Teams, Deployments, Private Keys
- **MCP Resources**: Direct resource access via `coolify://` URIs
- **Version Detection**: Automatic feature compatibility based on Coolify version
- **Rate Limiting**: Built-in rate limit handling with retry logic
- **Minimal Dependencies**: Only axios and MCP SDK
- **TypeScript**: Full type safety

## 📦 Installation

### From npm (recommended)

```bash
npm install -g coolify-mcp-server
```

### From source

```bash
git clone https://github.com/YOUR_USERNAME/coolify-mcp-server.git
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

### Servers
| Tool | Description |
|------|-------------|
| `list_servers` | List all servers |
| `create_server` | Create a new server |
| `validate_server` | Validate server connection |
| `get_server_resources` | Get server resource usage |
| `get_server_domains` | Get server domains |

### Projects & Environments
| Tool | Description |
|------|-------------|
| `list_projects` | List all projects |
| `get_project` | Get project details |
| `create_project` | Create a new project |
| `list_environments` | List project environments |
| `create_environment` | Create a new environment |

### Applications
| Tool | Description |
|------|-------------|
| `list_applications` | List all applications |
| `get_application` | Get application details |
| `create_application` | Create a new application |
| `start_application` | Start an application |
| `stop_application` | Stop an application |
| `restart_application` | Restart an application |
| `deploy_application` | Deploy an application |
| `execute_command` | Execute command in container |
| `get_application_logs` | Get application logs |

### Services
| Tool | Description |
|------|-------------|
| `list_services` | List all services |
| `create_service` | Create a new service |
| `start_service` | Start a service |
| `stop_service` | Stop a service |
| `restart_service` | Restart a service |

### Databases
| Tool | Description |
|------|-------------|
| `list_databases` | List all databases |
| `create_database` | Create a new database (PostgreSQL, MySQL, MongoDB, Redis) |

### Deployments
| Tool | Description |
|------|-------------|
| `list_deployments` | List all deployments |
| `get_deployment` | Get deployment details |

### Private Keys
| Tool | Description |
|------|-------------|
| `list_private_keys` | List all SSH private keys |
| `create_private_key` | Create a new SSH private key |

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
