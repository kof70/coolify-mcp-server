import { CoolifyClient } from '../client.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

type ToolArgs = Record<string, unknown>;

export async function handleTool(
  client: CoolifyClient,
  name: string,
  args: ToolArgs
): Promise<unknown> {
  switch (name) {
    // Version & Health
    case 'get_version':
      return client.get('/version');

    case 'health_check':
      try {
        return await client.get('/healthcheck');
      } catch {
        return { status: 'Health check endpoint not available in this Coolify version' };
      }

    // Teams
    case 'list_teams':
      return client.get('/teams');

    case 'get_team':
      requireParam(args, 'team_id');
      return client.get(`/teams/${args.team_id}`);

    case 'get_current_team':
      return client.get('/teams/current');

    case 'get_current_team_members':
      return client.get('/teams/current/members');

    // Servers
    case 'list_servers':
      return client.get('/servers');

    case 'create_server':
      requireParam(args, 'name');
      requireParam(args, 'ip');
      requireParam(args, 'private_key_uuid');
      return client.post('/servers', args);

    case 'validate_server':
      requireParam(args, 'uuid');
      return client.get(`/servers/${args.uuid}/validate`);

    case 'get_server_resources':
      requireParam(args, 'uuid');
      return client.get(`/servers/${args.uuid}/resources`);

    case 'get_server_domains':
      requireParam(args, 'uuid');
      return client.get(`/servers/${args.uuid}/domains`);

    // Projects
    case 'list_projects':
      return client.get('/projects');

    case 'get_project':
      requireParam(args, 'uuid');
      return client.get(`/projects/${args.uuid}`);

    case 'create_project':
      requireParam(args, 'name');
      return client.post('/projects', args);

    // Environments
    case 'list_environments':
      requireParam(args, 'project_uuid');
      return client.get(`/projects/${args.project_uuid}/environments`);

    case 'create_environment':
      requireParam(args, 'project_uuid');
      requireParam(args, 'name');
      return client.post('/environments', args);

    // Applications
    case 'list_applications':
      return client.get('/applications');

    case 'get_application':
      requireParam(args, 'uuid');
      return client.get(`/applications/${args.uuid}`);

    case 'create_application':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'destination_uuid');
      return client.post('/applications', args);

    case 'start_application':
      requireParam(args, 'uuid');
      return client.get(`/applications/${args.uuid}/start`);

    case 'stop_application':
      requireParam(args, 'uuid');
      return client.get(`/applications/${args.uuid}/stop`);

    case 'restart_application':
      requireParam(args, 'uuid');
      return client.get(`/applications/${args.uuid}/restart`);

    case 'deploy_application':
      requireParam(args, 'uuid');
      const deployParams = new URLSearchParams();
      if (args.tag) deployParams.append('tag', String(args.tag));
      if (args.force) deployParams.append('force', 'true');
      const deployQuery = deployParams.toString();
      return client.get(`/applications/${args.uuid}/deploy${deployQuery ? '?' + deployQuery : ''}`);

    case 'execute_command':
      requireParam(args, 'uuid');
      requireParam(args, 'command');
      if (!client.isFeatureAvailable('execute_command')) {
        return { error: 'Execute command not available in this Coolify version (requires beta.400+)' };
      }
      return client.post(`/applications/${args.uuid}/execute`, { command: args.command });

    case 'get_application_logs':
      requireParam(args, 'uuid');
      if (!client.isFeatureAvailable('application_logs')) {
        return { error: 'Application logs not available in this Coolify version (requires beta.380+)' };
      }
      return client.get(`/applications/${args.uuid}/logs`, { lines: args.lines || 100 });

    // Services
    case 'list_services':
      return client.get('/services');

    case 'create_service':
      requireParam(args, 'type');
      requireParam(args, 'name');
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      return client.post('/services', args);

    case 'start_service':
      requireParam(args, 'uuid');
      return client.get(`/services/${args.uuid}/start`);

    case 'stop_service':
      requireParam(args, 'uuid');
      return client.get(`/services/${args.uuid}/stop`);

    case 'restart_service':
      requireParam(args, 'uuid');
      return client.get(`/services/${args.uuid}/restart`);

    // Databases
    case 'list_databases':
      return client.get('/databases');

    case 'create_database':
      requireParam(args, 'name');
      requireParam(args, 'type');
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      return client.post('/databases', args);

    // Deployments
    case 'list_deployments':
      return client.get('/deployments');

    case 'get_deployment':
      requireParam(args, 'uuid');
      return client.get(`/deployments/${args.uuid}`);

    // Private Keys
    case 'list_private_keys':
      return client.get('/security/keys');

    case 'create_private_key':
      requireParam(args, 'name');
      requireParam(args, 'private_key');
      return client.post('/security/keys', args);

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }
}

function requireParam(args: ToolArgs, param: string): void {
  if (!args[param]) {
    throw new McpError(ErrorCode.InvalidParams, `${param} is required`);
  }
}
