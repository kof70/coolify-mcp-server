# feat: One-click installation / npx setup

**Labels:** `enhancement`, `documentation`

## Problem

Current installation requires multiple manual steps:
1. Clone repository
2. Install dependencies
3. Build
4. Manually configure mcp.json

Users want a simpler installation experience.

## Solution

### 1. Publish to npm

```json
// package.json
{
  "name": "coolify-mcp-server",
  "version": "1.0.0",
  "bin": {
    "coolify-mcp-server": "./build/index.js"
  },
  "files": [
    "build/",
    "README.md",
    "LICENSE"
  ]
}
```

### 2. Add Setup Command

```bash
npx coolify-mcp-server --setup
```

**Interactive setup wizard:**
```
🚀 Coolify MCP Server Setup

? Enter your Coolify URL: https://coolify.example.com
? Enter your API token: ****************************
? Enable read-only mode? (y/N): n
? Which IDE are you using? (Use arrow keys)
  ❯ Kiro
    Cursor
    VS Code (Continue)
    Claude Desktop
    Other

✅ Configuration saved to ~/.kiro/settings/mcp.json
✅ Coolify MCP Server is ready to use!

Test it by asking: "List my Coolify servers"
```

### 3. CLI Options

```bash
# Interactive setup
npx coolify-mcp-server --setup

# Quick setup with args
npx coolify-mcp-server --setup \
  --url https://coolify.example.com \
  --token your-token \
  --readonly

# Run server directly
npx coolify-mcp-server

# Show help
npx coolify-mcp-server --help

# Show version
npx coolify-mcp-server --version
```

### 4. Implementation

```typescript
// src/cli.ts
#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

program
  .option('--setup', 'Run interactive setup')
  .option('--url <url>', 'Coolify URL')
  .option('--token <token>', 'API token')
  .option('--readonly', 'Enable read-only mode')
  .parse();

const options = program.opts();

if (options.setup) {
  runSetup();
} else {
  // Start MCP server
  import('./index.js');
}

async function runSetup() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter your Coolify URL:',
      default: options.url
    },
    {
      type: 'password',
      name: 'token',
      message: 'Enter your API token:'
    },
    {
      type: 'confirm',
      name: 'readonly',
      message: 'Enable read-only mode?',
      default: false
    },
    {
      type: 'list',
      name: 'ide',
      message: 'Which IDE are you using?',
      choices: ['Kiro', 'Cursor', 'VS Code', 'Claude Desktop', 'Other']
    }
  ]);

  // Generate config based on IDE
  const config = generateConfig(answers);
  const configPath = getConfigPath(answers.ide);
  
  // Save config
  saveConfig(configPath, config);
  
  console.log(`✅ Configuration saved to ${configPath}`);
}
```

## Dependencies to Add

```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "inquirer": "^9.0.0"
  }
}
```

## Acceptance Criteria

- [ ] Package published to npm
- [ ] `npx coolify-mcp-server --setup` works
- [ ] Interactive setup wizard
- [ ] Support for multiple IDEs (Kiro, Cursor, VS Code, Claude Desktop)
- [ ] Auto-detect existing config and offer to update
- [ ] Validate Coolify URL and token during setup
- [ ] Clear success/error messages
- [ ] Documentation updated with new installation method
