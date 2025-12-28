import { CoolifyClient } from '../client.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { isConfirmRequired, isDangerousOperation, getDangerWarning } from './definitions.js';

type ToolArgs = Record<string, unknown>;

/**
 * Check if a dangerous operation has been confirmed
 * Returns an error response if confirmation is required but not provided
 */
function checkConfirmation(name: string, args: ToolArgs): { confirmed: boolean; response?: object } {
  if (!isConfirmRequired() || !isDangerousOperation(name)) {
    return { confirmed: true };
  }

  if (args.confirm === true) {
    return { confirmed: true };
  }

  return {
    confirmed: false,
    response: {
      confirmation_required: true,
      action: name,
      warning: getDangerWarning(name),
      message: `This is a dangerous operation. To proceed, call again with confirm: true`,
      example: { ...args, confirm: true }
    }
  };
}

export async function handleTool(
  client: CoolifyClient,
  name: string,
  args: ToolArgs
): Promise<unknown> {
  // Check confirmation for dangerous operations
  const confirmCheck = checkConfirmation(name, args);
  if (!confirmCheck.confirmed) {
    return confirmCheck.response;
  }

  switch (name) {
    // Version & Health
    case 'get_version':
      return client.get('/version');

    case 'health_check':
      try {
        return await client.get('/health');
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

    case 'get_server':
      requireParam(args, 'uuid');
      return client.get(`/servers/${args.uuid}`);

    case 'update_server':
      requireParam(args, 'uuid');
      return client.patch(`/servers/${args.uuid}`, args);

    case 'delete_server':
      requireParam(args, 'uuid');
      return client.delete(`/servers/${args.uuid}`);

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
      return client.post(`/projects/${args.project_uuid}/environments`, args);

    case 'get_environment':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name_or_uuid');
      return client.get(`/projects/${args.project_uuid}/${args.environment_name_or_uuid}`);

    case 'delete_environment':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name_or_uuid');
      return client.delete(`/projects/${args.project_uuid}/environments/${args.environment_name_or_uuid}`);

    case 'update_project':
      requireParam(args, 'uuid');
      return client.patch(`/projects/${args.uuid}`, args);

    case 'delete_project':
      requireParam(args, 'uuid');
      return client.delete(`/projects/${args.uuid}`);

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

    case 'create_public_application':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      requireParam(args, 'git_repository');
      requireParam(args, 'git_branch');
      requireParam(args, 'build_pack');
      requireParam(args, 'ports_exposes');
      return client.post('/applications/public', args);

    case 'create_private_github_app_application':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      requireParam(args, 'git_repository');
      requireParam(args, 'git_branch');
      requireParam(args, 'build_pack');
      requireParam(args, 'ports_exposes');
      requireParam(args, 'github_app_uuid');
      return client.post('/applications/private-github-app', args);

    case 'create_private_deploy_key_application':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      requireParam(args, 'git_repository');
      requireParam(args, 'git_branch');
      requireParam(args, 'build_pack');
      requireParam(args, 'ports_exposes');
      requireParam(args, 'private_key_uuid');
      return client.post('/applications/private-deploy-key', args);

    case 'create_dockerfile_application':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      requireParam(args, 'dockerfile');
      requireParam(args, 'ports_exposes');
      return client.post('/applications/dockerfile', args);

    case 'create_dockerimage_application':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      requireParam(args, 'docker_registry_image_name');
      requireParam(args, 'docker_registry_image_tag');
      requireParam(args, 'ports_exposes');
      return client.post('/applications/dockerimage', args);

    case 'create_dockercompose_application':
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      requireParam(args, 'docker_compose_raw');
      return client.post('/applications/dockercompose', args);

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
      deployParams.append('uuid', String(args.uuid));
      if (args.tag) deployParams.append('tag', String(args.tag));
      if (args.force) deployParams.append('force', 'true');
      if (args.instant_deploy) deployParams.append('instant_deploy', 'true');
      const deployQuery = deployParams.toString();
      return client.get(`/deploy?${deployQuery}`);

    case 'deploy':
      // Generic deploy endpoint supporting uuid and/or tag parameters
      const genericDeployParams = new URLSearchParams();
      if (args.uuid) genericDeployParams.append('uuid', String(args.uuid));
      if (args.tag) genericDeployParams.append('tag', String(args.tag));
      if (args.force) genericDeployParams.append('force', 'true');
      if (!args.uuid && !args.tag) {
        throw new McpError(ErrorCode.InvalidParams, 'Either uuid or tag parameter is required');
      }
      const genericDeployQuery = genericDeployParams.toString();
      return client.get(`/deploy?${genericDeployQuery}`);

    case 'execute_command':
      requireParam(args, 'uuid');
      requireParam(args, 'command');
      // This endpoint doesn't exist in Coolify API
      return { error: 'Execute command endpoint is not available in Coolify API. This feature is not supported via the API.' };

    case 'get_application_logs':
      requireParam(args, 'uuid');
      if (!client.isFeatureAvailable('application_logs')) {
        return { error: 'Application logs not available in this Coolify version (requires beta.380+)' };
      }
      return client.get(`/applications/${args.uuid}/logs`, { lines: args.lines || 100 });

    case 'update_application':
      requireParam(args, 'uuid');
      return client.patch(`/applications/${args.uuid}`, args);

    case 'delete_application':
      requireParam(args, 'uuid');
      return client.delete(`/applications/${args.uuid}`);

    case 'get_application_envs':
      requireParam(args, 'uuid');
      return client.get(`/applications/${args.uuid}/envs`);

    case 'create_application_env':
      requireParam(args, 'uuid');
      requireParam(args, 'key');
      return client.post(`/applications/${args.uuid}/envs`, args);

    case 'update_application_env':
      requireParam(args, 'uuid');
      requireParam(args, 'key');
      return client.patch(`/applications/${args.uuid}/envs`, args);

    case 'delete_application_env':
      requireParam(args, 'uuid');
      requireParam(args, 'env_uuid');
      return client.delete(`/applications/${args.uuid}/envs/${args.env_uuid}`);

    case 'update_application_envs_bulk':
      requireParam(args, 'uuid');
      requireParam(args, 'data');
      return client.patch(`/applications/${args.uuid}/envs/bulk`, { data: args.data });

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

    case 'get_service_logs':
      requireParam(args, 'uuid');
      // This endpoint doesn't exist in Coolify API
      // Services don't have a direct logs endpoint like applications
      return { error: 'Service logs endpoint is not available in Coolify API. Service logs are not exposed via the API.' };

    case 'get_service':
      requireParam(args, 'uuid');
      return client.get(`/services/${args.uuid}`);

    case 'update_service':
      requireParam(args, 'uuid');
      return client.patch(`/services/${args.uuid}`, args);

    case 'delete_service':
      requireParam(args, 'uuid');
      return client.delete(`/services/${args.uuid}`);

    case 'get_service_envs':
      requireParam(args, 'uuid');
      return client.get(`/services/${args.uuid}/envs`);

    case 'create_service_env':
      requireParam(args, 'uuid');
      requireParam(args, 'key');
      return client.post(`/services/${args.uuid}/envs`, args);

    case 'update_service_env':
      requireParam(args, 'uuid');
      requireParam(args, 'key');
      return client.patch(`/services/${args.uuid}/envs`, args);

    case 'delete_service_env':
      requireParam(args, 'uuid');
      requireParam(args, 'env_uuid');
      return client.delete(`/services/${args.uuid}/envs/${args.env_uuid}`);

    case 'update_service_envs_bulk':
      requireParam(args, 'uuid');
      requireParam(args, 'data');
      return client.patch(`/services/${args.uuid}/envs/bulk`, { data: args.data });

    // Databases
    case 'list_databases':
      return client.get('/databases');

    case 'create_database':
      requireParam(args, 'name');
      requireParam(args, 'type');
      requireParam(args, 'project_uuid');
      requireParam(args, 'environment_name');
      requireParam(args, 'server_uuid');
      // Coolify uses type-specific endpoints for database creation
      const dbType = String(args.type).toLowerCase();
      const validTypes: Record<string, string> = {
        'postgresql': '/databases/postgresql',
        'mysql': '/databases/mysql',
        'mariadb': '/databases/mariadb',
        'mongodb': '/databases/mongodb',
        'redis': '/databases/redis',
        'clickhouse': '/databases/clickhouse',
        'dragonfly': '/databases/dragonfly',
        'keydb': '/databases/keydb'
      };
      const endpoint = validTypes[dbType];
      if (!endpoint) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid database type: ${dbType}. Valid types are: ${Object.keys(validTypes).join(', ')}`);
      }
      return client.post(endpoint, args);

    case 'get_database_logs':
      requireParam(args, 'uuid');
      // This endpoint doesn't exist in Coolify API
      return { error: 'Database logs endpoint is not available in Coolify API. Database logs are not exposed via the API.' };

    case 'get_database':
      requireParam(args, 'uuid');
      return client.get(`/databases/${args.uuid}`);

    case 'update_database':
      requireParam(args, 'uuid');
      return client.patch(`/databases/${args.uuid}`, args);

    case 'delete_database':
      requireParam(args, 'uuid');
      return client.delete(`/databases/${args.uuid}`);

    case 'start_database':
      requireParam(args, 'uuid');
      return client.get(`/databases/${args.uuid}/start`);

    case 'stop_database':
      requireParam(args, 'uuid');
      return client.get(`/databases/${args.uuid}/stop`);

    case 'restart_database':
      requireParam(args, 'uuid');
      return client.get(`/databases/${args.uuid}/restart`);

    case 'get_database_backups':
      requireParam(args, 'uuid');
      return client.get(`/databases/${args.uuid}/backups`);

    case 'create_database_backup':
      requireParam(args, 'uuid');
      return client.post(`/databases/${args.uuid}/backups`, args);

    // Deployments
    case 'list_deployments':
      return client.get('/deployments');

    case 'get_deployment':
      requireParam(args, 'uuid');
      return client.get(`/deployments/${args.uuid}`);

    case 'cancel_deployment':
      requireParam(args, 'uuid');
      return client.post(`/deployments/${args.uuid}/cancel`);

    case 'get_application_deployments':
      requireParam(args, 'uuid');
      return client.get(`/deployments/applications/${args.uuid}`);

    // Private Keys
    case 'list_private_keys':
      return client.get('/security/keys');

    case 'create_private_key':
      requireParam(args, 'name');
      requireParam(args, 'private_key');
      return client.post('/security/keys', args);

    case 'get_private_key':
      requireParam(args, 'uuid');
      return client.get(`/security/keys/${args.uuid}`);

    case 'update_private_key':
      requireParam(args, 'uuid');
      return client.patch(`/security/keys/${args.uuid}`, args);

    case 'delete_private_key':
      requireParam(args, 'uuid');
      return client.delete(`/security/keys/${args.uuid}`);

    // GitHub Apps
    case 'list_github_apps':
      return client.get('/github-apps');

    case 'create_github_app':
      requireParam(args, 'name');
      return client.post('/github-apps', args);

    case 'get_github_app':
      requireParam(args, 'github_app_id');
      return client.get(`/github-apps/${args.github_app_id}`);

    case 'update_github_app':
      requireParam(args, 'github_app_id');
      return client.patch(`/github-apps/${args.github_app_id}`, args);

    case 'delete_github_app':
      requireParam(args, 'github_app_id');
      return client.delete(`/github-apps/${args.github_app_id}`);

    case 'get_github_app_repositories':
      requireParam(args, 'github_app_id');
      return client.get(`/github-apps/${args.github_app_id}/repositories`);

    case 'get_github_app_repository_branches':
      requireParam(args, 'github_app_id');
      requireParam(args, 'owner');
      requireParam(args, 'repo');
      return client.get(`/github-apps/${args.github_app_id}/repositories/${args.owner}/${args.repo}/branches`);

    // Resources
    case 'list_resources':
      return client.get('/resources');

    // Teams
    case 'get_team_members':
      requireParam(args, 'team_id');
      return client.get(`/teams/${args.team_id}/members`);

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }
}

function requireParam(args: ToolArgs, param: string): void {
  if (!args[param]) {
    throw new McpError(ErrorCode.InvalidParams, `${param} is required`);
  }
}
