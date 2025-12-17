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
import { getToolDefinitions, handleTool, isReadOnlyMode, READ_ONLY_TOOLS } from './tools/index.js';
import { resourceDefinitions, readResource } from './resources/index.js';

class CoolifyMcpServer {
  private server: Server;
  private client: CoolifyClient | null = null;

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

  private setupHandlers() {
    // List available tools (filtered by read-only mode)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: getToolDefinitions()
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (!this.client) {
        throw new McpError(ErrorCode.InternalError, 'Client not initialized');
      }

      const { name, arguments: args } = request.params;

      // Block write operations in read-only mode
      if (isReadOnlyMode() && !READ_ONLY_TOOLS.includes(name)) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Operation '${name}' is not allowed in read-only mode. Set COOLIFY_READONLY=false to enable write operations.`
        );
      }

      try {
        const result = await handleTool(this.client, name, args || {});
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
    const baseUrl = process.env.COOLIFY_BASE_URL || process.env.COOLIFY_API_URL;
    const token = process.env.COOLIFY_TOKEN || process.env.COOLIFY_API_TOKEN;
    const teamId = process.env.COOLIFY_TEAM_ID;

    if (!baseUrl || !token) {
      console.error('Error: COOLIFY_BASE_URL and COOLIFY_TOKEN environment variables are required');
      console.error('');
      console.error('Usage:');
      console.error('  COOLIFY_BASE_URL=https://your-coolify.com COOLIFY_TOKEN=your-token coolify-mcp');
      process.exit(1);
    }

    this.client = new CoolifyClient({ baseUrl, token, teamId });
    
    // Detect Coolify version for feature compatibility
    const version = await this.client.detectVersion();
    const mode = isReadOnlyMode() ? 'READ-ONLY' : 'FULL ACCESS';
    console.error(`Connected to Coolify ${version.version} [${mode}]`);
    
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
