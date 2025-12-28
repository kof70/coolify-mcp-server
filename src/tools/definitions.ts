// Tool definitions with detailed schemas and documentation

// Read-only tools that only fetch data without modifying anything
export const READ_ONLY_TOOLS = [
  'get_version',
  'health_check',
  'list_teams',
  'get_team',
  'get_current_team',
  'get_current_team_members',
  'get_team_members',
  'list_servers',
  'get_server',
  'get_server_resources',
  'get_server_domains',
  'list_projects',
  'get_project',
  'list_environments',
  'get_environment',
  'list_applications',
  'get_application',
  'get_application_logs',
  'get_application_envs',
  'get_application_deployments',
  'list_services',
  'get_service',
  'get_service_envs',
  'get_service_logs',
  'list_databases',
  'get_database',
  'get_database_backups',
  'get_database_logs',
  'list_deployments',
  'get_deployment',
  'list_private_keys',
  'get_private_key',
  'list_resources',
  'list_github_apps',
  'get_github_app',
  'get_github_app_repositories',
  'get_github_app_repository_branches'
];

// Dangerous operations that require confirmation when COOLIFY_REQUIRE_CONFIRM=true
export const DANGEROUS_OPERATIONS = [
  'stop_application',
  'restart_application',
  'stop_service',
  'restart_service',
  'stop_database',
  'restart_database',
  'deploy_application',
  'deploy',
  'execute_command',
  'delete_server',
  'delete_project',
  'delete_environment',
  'delete_application',
  'delete_service',
  'delete_database',
  'delete_private_key',
  'delete_github_app',
  'cancel_deployment'
];

// Warning messages for dangerous operations
export const DANGER_WARNINGS: Record<string, string> = {
  stop_application: 'This will stop the application and make it unavailable until restarted.',
  restart_application: 'This will restart the application, causing brief downtime.',
  stop_service: 'This will stop the service and make it unavailable until restarted.',
  restart_service: 'This will restart the service, causing brief downtime.',
  stop_database: 'This will stop the database and make it unavailable until restarted.',
  restart_database: 'This will restart the database, causing brief downtime.',
  deploy_application: 'This will deploy a new version of the application, which may cause downtime.',
  deploy: 'This will deploy resources by UUID or tag, which may cause downtime.',
  execute_command: 'This will execute a command inside the application container.',
  delete_server: 'This will permanently delete the server and all its resources.',
  delete_project: 'This will permanently delete the project and all its resources.',
  delete_environment: 'This will permanently delete the environment and all its resources.',
  delete_application: 'This will permanently delete the application and all its data.',
  delete_service: 'This will permanently delete the service and all its data.',
  delete_database: 'This will permanently delete the database and all its data.',
  delete_private_key: 'This will permanently delete the private key. Make sure no servers are using it.',
  delete_github_app: 'This will permanently delete the GitHub App configuration. Applications using it will lose access.',
  cancel_deployment: 'This will cancel the deployment in progress.'
};

/**
 * Check if confirmation is required for dangerous operations
 */
export function isConfirmRequired(): boolean {
  return process.env.COOLIFY_REQUIRE_CONFIRM === 'true';
}

/**
 * Check if an operation is dangerous
 */
export function isDangerousOperation(toolName: string): boolean {
  return DANGEROUS_OPERATIONS.includes(toolName);
}

/**
 * Get warning message for a dangerous operation
 */
export function getDangerWarning(toolName: string): string {
  return DANGER_WARNINGS[toolName] || 'This is a potentially dangerous operation.';
}

// All tool definitions
const allToolDefinitions = [
  // === Version & Health ===
  {
    name: 'get_version',
    description: 'Get Coolify version information',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'health_check',
    description: 'Check Coolify API health status',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },

  // === Teams ===
  {
    name: 'list_teams',
    description: 'List all teams accessible to the authenticated user',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_team',
    description: 'Get details of a specific team',
    inputSchema: {
      type: 'object',
      properties: {
        team_id: { type: 'string', description: 'Team ID' }
      },
      required: ['team_id']
    }
  },
  {
    name: 'get_current_team',
    description: 'Get details of the current team',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_current_team_members',
    description: 'Get members of the current team',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },

  // === Servers ===
  {
    name: 'list_servers',
    description: 'List all servers in Coolify',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'create_server',
    description: 'Create a new server',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Server name' },
        description: { type: 'string', description: 'Server description' },
        ip: { type: 'string', description: 'Server IP address' },
        port: { type: 'number', description: 'SSH port (default: 22)', default: 22 },
        user: { type: 'string', description: 'SSH user (default: root)', default: 'root' },
        private_key_uuid: { type: 'string', description: 'UUID of the private key for SSH' },
        is_build_server: { type: 'boolean', description: 'Use as build server', default: false },
        instant_validate: { type: 'boolean', description: 'Validate immediately', default: true }
      },
      required: ['name', 'ip', 'private_key_uuid']
    }
  },
  {
    name: 'validate_server',
    description: 'Validate server connection',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Server UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'get_server_resources',
    description: 'Get server resource usage',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Server UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'get_server_domains',
    description: 'Get domains configured on a server',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Server UUID' } },
      required: ['uuid']
    }
  },

  // === Projects ===
  {
    name: 'list_projects',
    description: 'List all projects',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_project',
    description: 'Get project details',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Project UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'create_project',
    description: 'Create a new project',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' }
      },
      required: ['name']
    }
  },

  // === Environments ===
  {
    name: 'list_environments',
    description: 'List environments in a project',
    inputSchema: {
      type: 'object',
      properties: { project_uuid: { type: 'string', description: 'Project UUID' } },
      required: ['project_uuid']
    }
  },
  {
    name: 'create_environment',
    description: 'Create a new environment in a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        name: { type: 'string', description: 'Environment name (e.g., production, staging)' }
      },
      required: ['project_uuid', 'name']
    }
  },

  // === Applications ===
  {
    name: 'list_applications',
    description: 'List all applications',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_application',
    description: 'Get application details',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Application UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'create_application',
    description: 'Create a new application',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        environment_uuid: { type: 'string', description: 'Environment UUID (optional)' },
        git_repository: { type: 'string', description: 'Git repository URL' },
        ports_exposes: { type: 'string', description: 'Ports to expose (e.g., "3000,8080")' },
        destination_uuid: { type: 'string', description: 'Destination server UUID' }
      },
      required: ['project_uuid', 'environment_name', 'destination_uuid']
    }
  },
  {
    name: 'create_public_application',
    description: 'Create a new public application from a public Git repository',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        environment_uuid: { type: 'string', description: 'Environment UUID (optional)' },
        server_uuid: { type: 'string', description: 'Server UUID' },
        destination_uuid: { type: 'string', description: 'Destination UUID (optional if server has single destination)' },
        git_repository: { type: 'string', description: 'Public Git repository URL' },
        git_branch: { type: 'string', description: 'Git branch name' },
        build_pack: { type: 'string', description: 'Build pack type (nixpacks, dockerfile, dockercompose)' },
        ports_exposes: { type: 'string', description: 'Ports to expose (e.g., "3000,8080")' },
        name: { type: 'string', description: 'Application name (optional, auto-generated if not provided)' },
        description: { type: 'string', description: 'Application description' },
        instant_deploy: { type: 'boolean', description: 'Deploy immediately after creation', default: false }
      },
      required: ['project_uuid', 'environment_name', 'server_uuid', 'git_repository', 'git_branch', 'build_pack', 'ports_exposes']
    }
  },
  {
    name: 'create_private_github_app_application',
    description: 'Create a new application from a private Git repository using GitHub App authentication',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        environment_uuid: { type: 'string', description: 'Environment UUID (optional)' },
        server_uuid: { type: 'string', description: 'Server UUID' },
        destination_uuid: { type: 'string', description: 'Destination UUID (optional if server has single destination)' },
        git_repository: { type: 'string', description: 'Private Git repository URL' },
        git_branch: { type: 'string', description: 'Git branch name' },
        build_pack: { type: 'string', description: 'Build pack type (nixpacks, dockerfile, dockercompose)' },
        ports_exposes: { type: 'string', description: 'Ports to expose (e.g., "3000,8080")' },
        github_app_uuid: { type: 'string', description: 'GitHub App UUID' },
        name: { type: 'string', description: 'Application name (optional, auto-generated if not provided)' },
        description: { type: 'string', description: 'Application description' },
        instant_deploy: { type: 'boolean', description: 'Deploy immediately after creation', default: false }
      },
      required: ['project_uuid', 'environment_name', 'server_uuid', 'git_repository', 'git_branch', 'build_pack', 'ports_exposes', 'github_app_uuid']
    }
  },
  {
    name: 'create_private_deploy_key_application',
    description: 'Create a new application from a private Git repository using deploy key authentication',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        environment_uuid: { type: 'string', description: 'Environment UUID (optional)' },
        server_uuid: { type: 'string', description: 'Server UUID' },
        destination_uuid: { type: 'string', description: 'Destination UUID (optional if server has single destination)' },
        git_repository: { type: 'string', description: 'Private Git repository URL' },
        git_branch: { type: 'string', description: 'Git branch name' },
        build_pack: { type: 'string', description: 'Build pack type (nixpacks, dockerfile, dockercompose)' },
        ports_exposes: { type: 'string', description: 'Ports to expose (e.g., "3000,8080")' },
        private_key_uuid: { type: 'string', description: 'Private key UUID for SSH authentication' },
        name: { type: 'string', description: 'Application name (optional, auto-generated if not provided)' },
        description: { type: 'string', description: 'Application description' },
        instant_deploy: { type: 'boolean', description: 'Deploy immediately after creation', default: false }
      },
      required: ['project_uuid', 'environment_name', 'server_uuid', 'git_repository', 'git_branch', 'build_pack', 'ports_exposes', 'private_key_uuid']
    }
  },
  {
    name: 'create_dockerfile_application',
    description: 'Create a new application from a Dockerfile',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        environment_uuid: { type: 'string', description: 'Environment UUID (optional)' },
        server_uuid: { type: 'string', description: 'Server UUID' },
        destination_uuid: { type: 'string', description: 'Destination UUID (optional if server has single destination)' },
        dockerfile: { type: 'string', description: 'Dockerfile content (base64 encoded)' },
        ports_exposes: { type: 'string', description: 'Ports to expose (e.g., "3000,8080")' },
        name: { type: 'string', description: 'Application name (optional, auto-generated if not provided)' },
        description: { type: 'string', description: 'Application description' },
        instant_deploy: { type: 'boolean', description: 'Deploy immediately after creation', default: false }
      },
      required: ['project_uuid', 'environment_name', 'server_uuid', 'dockerfile', 'ports_exposes']
    }
  },
  {
    name: 'create_dockerimage_application',
    description: 'Create a new application from a Docker image',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        environment_uuid: { type: 'string', description: 'Environment UUID (optional)' },
        server_uuid: { type: 'string', description: 'Server UUID' },
        destination_uuid: { type: 'string', description: 'Destination UUID (optional if server has single destination)' },
        docker_registry_image_name: { type: 'string', description: 'Docker image name (e.g., "nginx", "nginx:latest", "nginx:1.21")' },
        docker_registry_image_tag: { type: 'string', description: 'Docker image tag (optional if included in image name)' },
        ports_exposes: { type: 'string', description: 'Ports to expose (e.g., "3000,8080")' },
        name: { type: 'string', description: 'Application name (optional, auto-generated if not provided)' },
        description: { type: 'string', description: 'Application description' },
        instant_deploy: { type: 'boolean', description: 'Deploy immediately after creation', default: false }
      },
      required: ['project_uuid', 'environment_name', 'server_uuid', 'docker_registry_image_name', 'ports_exposes']
    }
  },
  {
    name: 'create_dockercompose_application',
    description: 'Create a new application from Docker Compose configuration',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        environment_uuid: { type: 'string', description: 'Environment UUID (optional)' },
        server_uuid: { type: 'string', description: 'Server UUID' },
        destination_uuid: { type: 'string', description: 'Destination UUID (optional if server has single destination)' },
        docker_compose_raw: { type: 'string', description: 'Docker Compose YAML content (base64 encoded)' },
        name: { type: 'string', description: 'Application name (optional, auto-generated if not provided)' },
        description: { type: 'string', description: 'Application description' },
        instant_deploy: { type: 'boolean', description: 'Deploy immediately after creation', default: false }
      },
      required: ['project_uuid', 'environment_name', 'server_uuid', 'docker_compose_raw']
    }
  },
  {
    name: 'start_application',
    description: 'Start an application',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Application UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'stop_application',
    description: 'Stop an application. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'restart_application',
    description: 'Restart an application. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'deploy_application',
    description: 'Deploy an application. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        tag: { type: 'string', description: 'Tag to deploy (optional)' },
        force: { type: 'boolean', description: 'Force rebuild without cache', default: false },
        instant_deploy: { type: 'boolean', description: 'Deploy immediately', default: false },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'deploy',
    description: 'Deploy resources by UUID or tag. Supports deploying multiple resources at once using comma-separated values.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Resource UUID(s) to deploy (comma-separated for multiple)' },
        tag: { type: 'string', description: 'Tag(s) to deploy (comma-separated for multiple)' },
        force: { type: 'boolean', description: 'Force rebuild without cache', default: false },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: []
    }
  },
  {
    name: 'execute_command',
    description: 'Execute a command in an application container. NOTE: This endpoint is not available in Coolify API and will return an error.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        command: { type: 'string', description: 'Command to execute' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid', 'command']
    }
  },
  {
    name: 'get_application_logs',
    description: 'Get application logs',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        lines: { type: 'number', description: 'Number of lines (default: 100)', default: 100 }
      },
      required: ['uuid']
    }
  },

  // === Services ===
  {
    name: 'list_services',
    description: 'List all services',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_service_logs',
    description: 'Get logs from a service. NOTE: This endpoint is not available in Coolify API and will return an error. Service logs are not exposed via the API.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        lines: { type: 'number', description: 'Number of lines (default: 100)', default: 100 }
      },
      required: ['uuid']
    }
  },
  {
    name: 'create_service',
    description: 'Create a new service',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Service type' },
        name: { type: 'string', description: 'Service name' },
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        server_uuid: { type: 'string', description: 'Server UUID' }
      },
      required: ['type', 'name', 'project_uuid', 'environment_name', 'server_uuid']
    }
  },
  {
    name: 'start_service',
    description: 'Start a service',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Service UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'stop_service',
    description: 'Stop a service. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'restart_service',
    description: 'Restart a service. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },

  // === Databases ===
  {
    name: 'list_databases',
    description: 'List all databases',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_database_logs',
    description: 'Get logs from a database. NOTE: This endpoint is not available in Coolify API and will return an error. Database logs are not exposed via the API.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Database UUID' },
        lines: { type: 'number', description: 'Number of lines (default: 100)', default: 100 }
      },
      required: ['uuid']
    }
  },
  {
    name: 'create_database',
    description: 'Create a new database. Valid types: postgresql, mysql, mariadb, mongodb, redis, clickhouse, dragonfly, keydb',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Database name' },
        type: { type: 'string', description: 'Database type (postgresql, mysql, mariadb, mongodb, redis, clickhouse, dragonfly, keydb)' },
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name: { type: 'string', description: 'Environment name' },
        server_uuid: { type: 'string', description: 'Server UUID' }
      },
      required: ['name', 'type', 'project_uuid', 'environment_name', 'server_uuid']
    }
  },

  // === Deployments ===
  {
    name: 'list_deployments',
    description: 'List all deployments',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_deployment',
    description: 'Get deployment details',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Deployment UUID' } },
      required: ['uuid']
    }
  },

  // === Private Keys ===
  {
    name: 'list_private_keys',
    description: 'List all SSH private keys',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'create_private_key',
    description: 'Create a new SSH private key',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Key name' },
        description: { type: 'string', description: 'Key description' },
        private_key: { type: 'string', description: 'Private key content (PEM format)' }
      },
      required: ['name', 'private_key']
    }
  },
  {
    name: 'get_private_key',
    description: 'Get a private key by UUID',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Private key UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'update_private_key',
    description: 'Update a private key',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Private key UUID' },
        name: { type: 'string', description: 'Key name' },
        description: { type: 'string', description: 'Key description' },
        private_key: { type: 'string', description: 'Private key content (PEM format)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'delete_private_key',
    description: 'Delete a private key. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Private key UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },

  // === GitHub Apps ===
  {
    name: 'list_github_apps',
    description: 'List all GitHub Apps configured in Coolify',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'create_github_app',
    description: 'Create a new GitHub App configuration',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'GitHub App name' },
        organization: { type: 'string', description: 'GitHub organization (optional)' },
        api_url: { type: 'string', description: 'GitHub API URL (for GitHub Enterprise)' },
        html_url: { type: 'string', description: 'GitHub HTML URL (for GitHub Enterprise)' },
        custom_user: { type: 'string', description: 'Custom Git user' },
        custom_port: { type: 'number', description: 'Custom Git port' },
        is_system_wide: { type: 'boolean', description: 'Make available system-wide', default: false }
      },
      required: ['name']
    }
  },
  {
    name: 'get_github_app',
    description: 'Get GitHub App details by ID',
    inputSchema: {
      type: 'object',
      properties: { github_app_id: { type: 'string', description: 'GitHub App ID' } },
      required: ['github_app_id']
    }
  },
  {
    name: 'update_github_app',
    description: 'Update a GitHub App configuration',
    inputSchema: {
      type: 'object',
      properties: {
        github_app_id: { type: 'string', description: 'GitHub App ID' },
        name: { type: 'string', description: 'GitHub App name' },
        organization: { type: 'string', description: 'GitHub organization' },
        api_url: { type: 'string', description: 'GitHub API URL' },
        html_url: { type: 'string', description: 'GitHub HTML URL' },
        custom_user: { type: 'string', description: 'Custom Git user' },
        custom_port: { type: 'number', description: 'Custom Git port' },
        is_system_wide: { type: 'boolean', description: 'Make available system-wide' }
      },
      required: ['github_app_id']
    }
  },
  {
    name: 'delete_github_app',
    description: 'Delete a GitHub App configuration. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        github_app_id: { type: 'string', description: 'GitHub App ID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['github_app_id']
    }
  },
  {
    name: 'get_github_app_repositories',
    description: 'Get repositories accessible by a GitHub App',
    inputSchema: {
      type: 'object',
      properties: { github_app_id: { type: 'string', description: 'GitHub App ID' } },
      required: ['github_app_id']
    }
  },
  {
    name: 'get_github_app_repository_branches',
    description: 'Get branches of a repository accessible by a GitHub App',
    inputSchema: {
      type: 'object',
      properties: {
        github_app_id: { type: 'string', description: 'GitHub App ID' },
        owner: { type: 'string', description: 'Repository owner' },
        repo: { type: 'string', description: 'Repository name' }
      },
      required: ['github_app_id', 'owner', 'repo']
    }
  },

  {
    name: 'get_server',
    description: 'Get server details by UUID',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Server UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'update_server',
    description: 'Update a server',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Server UUID' },
        name: { type: 'string', description: 'Server name' },
        description: { type: 'string', description: 'Server description' },
        ip: { type: 'string', description: 'Server IP address' },
        port: { type: 'number', description: 'SSH port' },
        user: { type: 'string', description: 'SSH user' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'delete_server',
    description: 'Delete a server. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Server UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'update_project',
    description: 'Update a project',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Project UUID' },
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'delete_project',
    description: 'Delete a project. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Project UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'get_environment',
    description: 'Get environment details',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name_or_uuid: { type: 'string', description: 'Environment name or UUID' }
      },
      required: ['project_uuid', 'environment_name_or_uuid']
    }
  },
  {
    name: 'delete_environment',
    description: 'Delete an environment. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        project_uuid: { type: 'string', description: 'Project UUID' },
        environment_name_or_uuid: { type: 'string', description: 'Environment name or UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['project_uuid', 'environment_name_or_uuid']
    }
  },
  {
    name: 'update_application',
    description: 'Update an application',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        name: { type: 'string', description: 'Application name' },
        description: { type: 'string', description: 'Application description' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'delete_application',
    description: 'Delete an application. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'get_application_envs',
    description: 'Get environment variables for an application',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Application UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'create_application_env',
    description: 'Create an environment variable for an application',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        key: { type: 'string', description: 'Environment variable key' },
        value: { type: 'string', description: 'Environment variable value' },
        is_preview: { type: 'boolean', description: 'Use in preview deployments', default: false },
        is_literal: { type: 'boolean', description: 'Is literal value', default: false },
        is_multiline: { type: 'boolean', description: 'Is multiline value', default: false }
      },
      required: ['uuid', 'key']
    }
  },
  {
    name: 'update_application_env',
    description: 'Update an environment variable for an application',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        key: { type: 'string', description: 'Environment variable key' },
        value: { type: 'string', description: 'Environment variable value' },
        is_preview: { type: 'boolean', description: 'Use in preview deployments' },
        is_literal: { type: 'boolean', description: 'Is literal value' },
        is_multiline: { type: 'boolean', description: 'Is multiline value' }
      },
      required: ['uuid', 'key']
    }
  },
  {
    name: 'delete_application_env',
    description: 'Delete an environment variable from an application',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        env_uuid: { type: 'string', description: 'Environment variable UUID' }
      },
      required: ['uuid', 'env_uuid']
    }
  },
  {
    name: 'update_application_envs_bulk',
    description: 'Update multiple environment variables for an application in bulk',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        data: { 
          type: 'array', 
          description: 'Array of environment variables to update',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string', description: 'Environment variable key' },
              value: { type: 'string', description: 'Environment variable value' },
              is_preview: { type: 'boolean', description: 'Use in preview deployments' },
              is_literal: { type: 'boolean', description: 'Is literal value' },
              is_multiline: { type: 'boolean', description: 'Is multiline value' }
            },
            required: ['key', 'value']
          }
        }
      },
      required: ['uuid', 'data']
    }
  },
  {
    name: 'get_service',
    description: 'Get service details by UUID',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Service UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'update_service',
    description: 'Update a service',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        name: { type: 'string', description: 'Service name' },
        description: { type: 'string', description: 'Service description' },
        docker_compose_raw: { type: 'string', description: 'Docker Compose raw content (base64 encoded)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'delete_service',
    description: 'Delete a service. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'get_service_envs',
    description: 'Get environment variables for a service',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Service UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'create_service_env',
    description: 'Create an environment variable for a service',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        key: { type: 'string', description: 'Environment variable key' },
        value: { type: 'string', description: 'Environment variable value' },
        is_preview: { type: 'boolean', description: 'Use in preview deployments', default: false },
        is_literal: { type: 'boolean', description: 'Is literal value', default: false },
        is_multiline: { type: 'boolean', description: 'Is multiline value', default: false }
      },
      required: ['uuid', 'key']
    }
  },
  {
    name: 'update_service_env',
    description: 'Update an environment variable for a service',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        key: { type: 'string', description: 'Environment variable key' },
        value: { type: 'string', description: 'Environment variable value' },
        is_preview: { type: 'boolean', description: 'Use in preview deployments' },
        is_literal: { type: 'boolean', description: 'Is literal value' },
        is_multiline: { type: 'boolean', description: 'Is multiline value' }
      },
      required: ['uuid', 'key']
    }
  },
  {
    name: 'delete_service_env',
    description: 'Delete an environment variable from a service',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        env_uuid: { type: 'string', description: 'Environment variable UUID' }
      },
      required: ['uuid', 'env_uuid']
    }
  },
  {
    name: 'update_service_envs_bulk',
    description: 'Update multiple environment variables for a service in bulk',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Service UUID' },
        data: { 
          type: 'array', 
          description: 'Array of environment variables to update',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string', description: 'Environment variable key' },
              value: { type: 'string', description: 'Environment variable value' },
              is_preview: { type: 'boolean', description: 'Use in preview deployments' },
              is_literal: { type: 'boolean', description: 'Is literal value' },
              is_multiline: { type: 'boolean', description: 'Is multiline value' }
            },
            required: ['key', 'value']
          }
        }
      },
      required: ['uuid', 'data']
    }
  },
  {
    name: 'get_database',
    description: 'Get database details by UUID',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Database UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'update_database',
    description: 'Update a database',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Database UUID' },
        name: { type: 'string', description: 'Database name' },
        description: { type: 'string', description: 'Database description' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'delete_database',
    description: 'Delete a database. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Database UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'start_database',
    description: 'Start a database',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Database UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'stop_database',
    description: 'Stop a database. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Database UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'restart_database',
    description: 'Restart a database. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Database UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'get_database_backups',
    description: 'Get backup configurations for a database',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Database UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'create_database_backup',
    description: 'Create a backup configuration for a database',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Database UUID' },
        enabled: { type: 'boolean', description: 'Enable scheduled backups', default: true },
        frequency: { type: 'string', description: 'Backup frequency (e.g., daily, weekly)' },
        retention: { type: 'number', description: 'Number of backups to retain' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'cancel_deployment',
    description: 'Cancel a deployment. When COOLIFY_REQUIRE_CONFIRM=true, requires confirm: true parameter.',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Deployment UUID' },
        confirm: { type: 'boolean', description: 'Confirm the dangerous operation (required when COOLIFY_REQUIRE_CONFIRM=true)' }
      },
      required: ['uuid']
    }
  },
  {
    name: 'get_application_deployments',
    description: 'Get all deployments for an application',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Application UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'list_resources',
    description: 'List all resources (applications, services, databases)',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_team_members',
    description: 'Get members of a specific team',
    inputSchema: {
      type: 'object',
      properties: { team_id: { type: 'string', description: 'Team ID' } },
      required: ['team_id']
    }
  }
];

/**
 * Check if read-only mode is enabled
 */
export function isReadOnlyMode(): boolean {
  return process.env.COOLIFY_READONLY === 'true';
}

/**
 * Get tool definitions based on mode (read-only or full access)
 * When COOLIFY_READONLY=true, only read-only tools are exposed
 */
export function getToolDefinitions() {
  if (isReadOnlyMode()) {
    return allToolDefinitions.filter(tool => READ_ONLY_TOOLS.includes(tool.name));
  }
  return allToolDefinitions;
}

// Export for backward compatibility
export const toolDefinitions = getToolDefinitions();
