#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { CoolifyClient } from './client.js';
import { AccountsManager } from './accounts.js';
import { getToolDefinitions, handleTool, isReadOnlyMode, READ_ONLY_TOOLS } from './tools/index.js';
import { resourceDefinitions, readResource } from './resources/index.js';

class CoolifyMcpServer {
  private server: Server;
  private client: CoolifyClient | null = null;
  private accounts: AccountsManager = new AccountsManager();
  private activeAccountName: string | null = null;

  constructor() {
    this.server = new Server(
      { name: 'coolify-mcp-server', version: '1.0.0' },
      { capabilities: { tools: {}, resources: {} } }
    );

    this.server.onerror = (error: Error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private async activateAccount(name: string): Promise<{ name: string; baseUrl: string; version: string }> {
    const account = this.accounts.get(name);
    if (!account) {
      const known = this.accounts.list().map((a) => a.name).join(', ') || '(none configured)';
      throw new McpError(ErrorCode.InvalidParams, `Unknown account "${name}". Known accounts: ${known}`);
    }
    const client = new CoolifyClient(account);
    const version = await client.detectVersion();
    this.client = client;
    this.activeAccountName = name;
    return { name, baseUrl: account.baseUrl, version: version.version };
  }

  private setupHandlers() {
    // List available tools (filtered by read-only mode)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: getToolDefinitions()
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const toolArgs = (args || {}) as Record<string, unknown>;

      // Block write operations in read-only mode
      if (isReadOnlyMode() && !READ_ONLY_TOOLS.includes(name)) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Operation '${name}' is not allowed in read-only mode. Set COOLIFY_READONLY=false to enable write operations.`
        );
      }

      // Meta-tools de gestion multi-compte : gérés ici, avant le
      // dispatch générique, car ils doivent pouvoir remplacer this.client.
      try {
        if (name === 'list_accounts') {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ active: this.activeAccountName, accounts: this.accounts.list() }, null, 2)
            }]
          };
        }
        if (name === 'switch_account') {
          if (typeof toolArgs.name !== 'string') {
            throw new McpError(ErrorCode.InvalidParams, 'Missing required parameter: name');
          }
          const result = await this.activateAccount(toolArgs.name);
          return { content: [{ type: 'text', text: JSON.stringify({ switched_to: result }, null, 2) }] };
        }
        if (name === 'add_account') {
          const { name: accountName, base_url, token, team_id, set_default } = toolArgs as {
            name?: string; base_url?: string; token?: string; team_id?: string; set_default?: boolean;
          };
          if (!accountName || !base_url || !token) {
            throw new McpError(ErrorCode.InvalidParams, 'Missing required parameters: name, base_url, token');
          }
          this.accounts.upsert({ name: accountName, baseUrl: base_url, token, teamId: team_id });
          if (set_default) {
            this.accounts.setDefault(accountName);
          }
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ saved: accountName, hint: 'call switch_account to start using it' }, null, 2)
            }]
          };
        }
      } catch (error) {
        if (error instanceof McpError) throw error;
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, `Account tool failed: ${message}`);
      }

      if (!this.client) {
        throw new McpError(ErrorCode.InternalError, 'Client not initialized');
      }

      try {
        const result = await handleTool(this.client, name, toolArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        if (error instanceof McpError) throw error;

        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${message}`);
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: resourceDefinitions
    }));

    // Read resource content
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      if (!this.client) {
        throw new McpError(ErrorCode.InternalError, 'Client not initialized');
      }

      const { uri } = request.params;

      try {
        const data = await readResource(this.client, uri);
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2)
          }]
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, `Failed to read resource: ${message}`);
      }
    });
  }

  async run() {
    const defaultAccount = this.accounts.getDefaultName();
    if (!defaultAccount) {
      console.error('Error: no Coolify account configured.');
      console.error('');
      console.error('Either set COOLIFY_BASE_URL + COOLIFY_TOKEN environment variables,');
      console.error(`or create ${process.env.COOLIFY_ACCOUNTS_FILE || '~/.config/coolify-mcp/accounts.json'}`);
      console.error('with { "default": "name", "accounts": [{ "name", "baseUrl", "token" }] }.');
      process.exit(1);
    }

    const { version } = await this.activateAccount(defaultAccount);
    const mode = isReadOnlyMode() ? 'READ-ONLY' : 'FULL ACCESS';
    const known = this.accounts.list().map((a) => a.name).join(', ');
    console.error(`Connected to Coolify ${version} as account "${defaultAccount}" [${mode}]`);
    console.error(`Known accounts (switch_account to change): ${known}`);

    if (isReadOnlyMode()) {
      console.error('Read-only mode enabled: write operations are disabled');
    }

    this.setupHandlers();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Coolify MCP server running on stdio');
  }
}

const server = new CoolifyMcpServer();
server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
