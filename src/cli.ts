#!/usr/bin/env node
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const VERSION = '1.2.0';

interface SetupAnswers {
  url: string;
  token: string;
  readonly: boolean;
  ide: string;
}

const IDE_CONFIGS: Record<string, { path: string; name: string }> = {
  kiro: { path: path.join(os.homedir(), '.kiro', 'settings', 'mcp.json'), name: 'Kiro' },
  cursor: { path: path.join(os.homedir(), '.cursor', 'mcp.json'), name: 'Cursor' },
  vscode: { path: path.join(os.homedir(), '.vscode', 'mcp.json'), name: 'VS Code' },
  claude: { path: path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'), name: 'Claude Desktop' },
};

function createReadline(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function question(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()));
  });
}

async function confirm(rl: readline.Interface, prompt: string, defaultValue = false): Promise<boolean> {
  const suffix = defaultValue ? '(Y/n)' : '(y/N)';
  const answer = await question(rl, `${prompt} ${suffix}: `);
  if (!answer) return defaultValue;
  return answer.toLowerCase().startsWith('y');
}

function printBanner(): void {
  console.log(`
 Coolify MCP Server Setup v${VERSION}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

function printHelp(): void {
  console.log(`
Usage: coolify-mcp [options]

Options:
  --setup              Run interactive setup wizard
  --url <url>          Coolify instance URL
  --token <token>      API token
  --readonly           Enable read-only mode
  --ide <ide>          Target IDE (kiro, cursor, vscode, claude)
  --help, -h           Show this help message
  --version, -v        Show version

Examples:
  npx coolify-mcp-server --setup
  npx coolify-mcp-server --setup --url https://coolify.example.com --token xxx
  npx coolify-mcp-server --setup --ide kiro --readonly

Without options, starts the MCP server (requires env vars).
`);
}

async function validateCoolifyConnection(url: string, token: string): Promise<{ valid: boolean; version?: string; error?: string }> {
  try {
    const axios = (await import('axios')).default;
    const response = await axios.get(`${url}/api/v1/version`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    return { valid: true, version: response.data?.version || 'unknown' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { valid: false, error: message };
  }
}

function generateMcpConfig(answers: SetupAnswers): object {
  const env: Record<string, string> = {
    COOLIFY_BASE_URL: answers.url,
    COOLIFY_TOKEN: answers.token,
  };
  
  if (answers.readonly) {
    env.COOLIFY_READONLY = 'true';
  }

  return {
    mcpServers: {
      coolify: {
        command: 'npx',
        args: ['-y', 'coolify-mcp-server'],
        env,
      },
    },
  };
}

function ensureDirectoryExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadExistingConfig(configPath: string): object {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // Ignore parse errors, start fresh
  }
  return {};
}

function saveConfig(configPath: string, newConfig: object): void {
  ensureDirectoryExists(configPath);
  
  const existingConfig = loadExistingConfig(configPath);
  const mergedConfig = {
    ...existingConfig,
    mcpServers: {
      ...(existingConfig as { mcpServers?: object }).mcpServers,
      ...(newConfig as { mcpServers: object }).mcpServers,
    },
  };
  
  fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2));
}

async function runSetup(args: string[]): Promise<void> {
  printBanner();
  
  const rl = createReadline();
  
  try {
    // Parse command line args for pre-filled values
    const urlArg = getArgValue(args, '--url');
    const tokenArg = getArgValue(args, '--token');
    const ideArg = getArgValue(args, '--ide');
    const readonlyArg = args.includes('--readonly');
    
    // Get Coolify URL
    let url = urlArg;
    if (!url) {
      url = await question(rl, '📍 Enter your Coolify URL: ');
    }
    
    if (!url) {
      console.error('❌ Coolify URL is required');
      process.exit(1);
    }
    
    // Normalize URL
    url = url.replace(/\/+$/, '');
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    
    // Get API token
    let token = tokenArg;
    if (!token) {
      console.log('\n💡 Get your API token from: Coolify Dashboard > Keys & Tokens > API tokens\n');
      token = await question(rl, '🔑 Enter your API token: ');
    }
    
    if (!token) {
      console.error('❌ API token is required');
      process.exit(1);
    }
    
    // Validate connection
    console.log('\n⏳ Validating connection...');
    const validation = await validateCoolifyConnection(url, token);
    
    if (!validation.valid) {
      console.error(`❌ Connection failed: ${validation.error}`);
      console.error('\nPlease check:');
      console.error('  - Your Coolify URL is correct and accessible');
      console.error('  - Your API token is valid');
      console.error('  - Your Coolify instance is running');
      process.exit(1);
    }
    
    console.log(`✅ Connected to Coolify ${validation.version}`);
    
    // Read-only mode
    let readonly = readonlyArg;
    if (!readonlyArg && !args.includes('--url')) {
      readonly = await confirm(rl, '\n🔒 Enable read-only mode? (safer for monitoring)', false);
    }
    
    // Select IDE
    let ide = ideArg?.toLowerCase();
    if (!ide) {
      console.log('\n📝 Select your IDE:');
      console.log('  1. Kiro');
      console.log('  2. Cursor');
      console.log('  3. VS Code (Continue)');
      console.log('  4. Claude Desktop');
      console.log('  5. Other (print config)');
      
      const ideChoice = await question(rl, '\nEnter choice (1-5): ');
      const ideMap: Record<string, string> = { '1': 'kiro', '2': 'cursor', '3': 'vscode', '4': 'claude', '5': 'other' };
      ide = ideMap[ideChoice] || 'other';
    }
    
    const answers: SetupAnswers = { url, token, readonly, ide };
    const config = generateMcpConfig(answers);
    
    if (ide === 'other' || !IDE_CONFIGS[ide]) {
      console.log('\n📋 Add this to your MCP configuration:\n');
      console.log(JSON.stringify(config, null, 2));
      console.log('\n✅ Setup complete! Copy the config above to your IDE.');
    } else {
      const ideConfig = IDE_CONFIGS[ide];
      saveConfig(ideConfig.path, config);
      
      console.log(`\n✅ Configuration saved to ${ideConfig.path}`);
      console.log(`\n🎉 Coolify MCP Server is ready to use with ${ideConfig.name}!`);
      console.log('\n💡 Try asking: "List my Coolify servers" or "Show my applications"');
    }
    
    if (readonly) {
      console.log('\n🔒 Read-only mode is enabled. Only monitoring operations are available.');
    }
    
  } finally {
    rl.close();
  }
}

function getArgValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return undefined;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    console.log(`coolify-mcp-server v${VERSION}`);
    process.exit(0);
  }
  
  if (args.includes('--setup')) {
    await runSetup(args);
    process.exit(0);
  }
  
  // No setup flag - start the MCP server
  await import('./index.js');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
