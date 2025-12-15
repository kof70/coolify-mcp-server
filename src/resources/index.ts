import { CoolifyClient } from '../client.js';

// MCP Resource definitions (like JoshuaRileyDev's implementation)
export const resourceDefinitions = [
  {
    uri: 'coolify://applications',
    mimeType: 'application/json',
    name: 'Coolify Applications',
    description: 'List all applications in Coolify'
  },
  {
    uri: 'coolify://databases',
    mimeType: 'application/json',
    name: 'Coolify Databases',
    description: 'List all databases in Coolify'
  },
  {
    uri: 'coolify://servers',
    mimeType: 'application/json',
    name: 'Coolify Servers',
    description: 'List all servers in Coolify'
  },
  {
    uri: 'coolify://projects',
    mimeType: 'application/json',
    name: 'Coolify Projects',
    description: 'List all projects in Coolify'
  },
  {
    uri: 'coolify://services',
    mimeType: 'application/json',
    name: 'Coolify Services',
    description: 'List all services in Coolify'
  },
  {
    uri: 'coolify://teams',
    mimeType: 'application/json',
    name: 'Coolify Teams',
    description: 'List all teams in Coolify'
  },
  {
    uri: 'coolify://deployments',
    mimeType: 'application/json',
    name: 'Coolify Deployments',
    description: 'List all deployments in Coolify'
  },
  {
    uri: 'coolify://private-keys',
    mimeType: 'application/json',
    name: 'Coolify Private Keys',
    description: 'List all SSH private keys in Coolify'
  }
];

export async function readResource(client: CoolifyClient, uri: string): Promise<unknown> {
  const endpoints: Record<string, string> = {
    'coolify://applications': '/applications',
    'coolify://databases': '/databases',
    'coolify://servers': '/servers',
    'coolify://projects': '/projects',
    'coolify://services': '/services',
    'coolify://teams': '/teams',
    'coolify://deployments': '/deployments',
    'coolify://private-keys': '/security/keys'
  };

  const endpoint = endpoints[uri];
  if (!endpoint) {
    throw new Error(`Unknown resource: ${uri}`);
  }

  return client.get(endpoint);
}
