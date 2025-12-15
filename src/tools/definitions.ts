// Tool definitions with detailed schemas and documentation
export const toolDefinitions = [
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
    description: 'Stop an application',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Application UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'restart_application',
    description: 'Restart an application',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Application UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'deploy_application',
    description: 'Deploy an application',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        tag: { type: 'string', description: 'Tag to deploy (optional)' },
        force: { type: 'boolean', description: 'Force rebuild without cache', default: false }
      },
      required: ['uuid']
    }
  },
  {
    name: 'execute_command',
    description: 'Execute a command in an application container',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Application UUID' },
        command: { type: 'string', description: 'Command to execute' }
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
    description: 'Stop a service',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Service UUID' } },
      required: ['uuid']
    }
  },
  {
    name: 'restart_service',
    description: 'Restart a service',
    inputSchema: {
      type: 'object',
      properties: { uuid: { type: 'string', description: 'Service UUID' } },
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
    name: 'create_database',
    description: 'Create a new database',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Database name' },
        type: { type: 'string', description: 'Database type (postgresql, mysql, mongodb, redis)' },
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
  }
];
