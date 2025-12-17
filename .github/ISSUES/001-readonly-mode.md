# feat: Add read-only mode for safe monitoring

**Labels:** `enhancement`, `security`, `good first issue`

## Problem

Users want to try the MCP server but are concerned about accidentally triggering destructive actions (stop, restart, deploy, delete). They need a safe way to monitor their Coolify infrastructure without risk.

## Solution

Add a `COOLIFY_READONLY=true` environment variable that:

1. **Only exposes read-only tools:**
   - `get_version`, `health_check`
   - `list_teams`, `get_team`, `get_current_team`, `get_current_team_members`
   - `list_servers`, `get_server_resources`, `get_server_domains`
   - `list_projects`, `get_project`
   - `list_environments`
   - `list_applications`, `get_application`, `get_application_logs`
   - `list_services`
   - `list_databases`
   - `list_deployments`, `get_deployment`
   - `list_private_keys`

2. **Hides all write operations:**
   - `create_*`
   - `start_*`, `stop_*`, `restart_*`
   - `deploy_*`
   - `execute_command`
   - `validate_server`

## Implementation

```typescript
// In src/tools/definitions.ts
export const READ_ONLY_TOOLS = [
  'get_version', 'health_check',
  'list_teams', 'get_team', 'get_current_team', 'get_current_team_members',
  'list_servers', 'get_server_resources', 'get_server_domains',
  'list_projects', 'get_project',
  'list_environments',
  'list_applications', 'get_application', 'get_application_logs',
  'list_services',
  'list_databases',
  'list_deployments', 'get_deployment',
  'list_private_keys'
];

export function getToolDefinitions() {
  const isReadOnly = process.env.COOLIFY_READONLY === 'true';
  
  if (isReadOnly) {
    return toolDefinitions.filter(tool => READ_ONLY_TOOLS.includes(tool.name));
  }
  
  return toolDefinitions;
}
```

## Configuration

```bash
# .env
COOLIFY_READONLY=true
```

```json
// mcp.json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": ["path/to/coolify-mcp-server/build/index.js"],
      "env": {
        "COOLIFY_BASE_URL": "https://coolify.example.com",
        "COOLIFY_API_TOKEN": "your-token",
        "COOLIFY_READONLY": "true"
      }
    }
  }
}
```

## Use Cases

- **Monitoring dashboards** - View infrastructure status without risk
- **Demo environments** - Show capabilities safely
- **Limited access users** - Give read access to team members
- **Testing** - Verify setup before enabling write operations

## Acceptance Criteria

- [ ] `COOLIFY_READONLY=true` hides all write tools
- [ ] Read-only tools work normally
- [ ] Documentation updated in README
- [ ] `.env.example` updated with new variable
