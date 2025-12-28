import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleTool } from './handlers.js';
import { CoolifyClient } from '../client.js';

// Mock CoolifyClient
const createMockClient = () => {
  return {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    isFeatureAvailable: vi.fn().mockReturnValue(true),
  } as unknown as CoolifyClient;
};

describe('Tool Handlers', () => {
  let mockClient: CoolifyClient;
  const originalEnv = process.env;

  beforeEach(() => {
    mockClient = createMockClient();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.COOLIFY_REQUIRE_CONFIRM;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Version & Health', () => {
    it('should handle get_version', async () => {
      const mockVersion = { version: '4.0.0-beta.420' };
      vi.mocked(mockClient.get).mockResolvedValue(mockVersion);

      const result = await handleTool(mockClient, 'get_version', {});

      expect(mockClient.get).toHaveBeenCalledWith('/version');
      expect(result).toEqual(mockVersion);
    });

    it('should handle health_check', async () => {
      const mockHealth = { status: 'ok' };
      vi.mocked(mockClient.get).mockResolvedValue(mockHealth);

      const result = await handleTool(mockClient, 'health_check', {});

      expect(mockClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockHealth);
    });
  });

  describe('Servers', () => {
    it('should handle list_servers', async () => {
      const mockServers = [{ id: 1, name: 'server1' }];
      vi.mocked(mockClient.get).mockResolvedValue(mockServers);

      const result = await handleTool(mockClient, 'list_servers', {});

      expect(mockClient.get).toHaveBeenCalledWith('/servers');
      expect(result).toEqual(mockServers);
    });

    it('should handle create_server with required params', async () => {
      const mockResponse = { uuid: 'abc123' };
      vi.mocked(mockClient.post).mockResolvedValue(mockResponse);

      const args = {
        name: 'test-server',
        ip: '192.168.1.1',
        private_key_uuid: 'key-123',
      };

      const result = await handleTool(mockClient, 'create_server', args);

      expect(mockClient.post).toHaveBeenCalledWith('/servers', args);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when required params are missing', async () => {
      await expect(handleTool(mockClient, 'create_server', { name: 'test' })).rejects.toThrow(
        'ip is required'
      );
    });
  });

  describe('Applications', () => {
    it('should handle list_applications', async () => {
      const mockApps = [{ uuid: 'app1', name: 'my-app' }];
      vi.mocked(mockClient.get).mockResolvedValue(mockApps);

      const result = await handleTool(mockClient, 'list_applications', {});

      expect(mockClient.get).toHaveBeenCalledWith('/applications');
      expect(result).toEqual(mockApps);
    });

    it('should handle get_application', async () => {
      const mockApp = { uuid: 'app1', name: 'my-app', status: 'running' };
      vi.mocked(mockClient.get).mockResolvedValue(mockApp);

      const result = await handleTool(mockClient, 'get_application', { uuid: 'app1' });

      expect(mockClient.get).toHaveBeenCalledWith('/applications/app1');
      expect(result).toEqual(mockApp);
    });

    it('should handle start_application', async () => {
      const mockResponse = { message: 'Application started' };
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await handleTool(mockClient, 'start_application', { uuid: 'app1' });

      expect(mockClient.get).toHaveBeenCalledWith('/applications/app1/start');
      expect(result).toEqual(mockResponse);
    });

    it('should handle deploy_application with force flag', async () => {
      const mockResponse = { deployment_uuid: 'deploy-123' };
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await handleTool(mockClient, 'deploy_application', {
        uuid: 'app1',
        force: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/deploy?uuid=app1&force=true');
      expect(result).toEqual(mockResponse);
    });

    it('should handle get_application_logs', async () => {
      const mockLogs = { logs: 'Application started...' };
      vi.mocked(mockClient.get).mockResolvedValue(mockLogs);

      const result = await handleTool(mockClient, 'get_application_logs', {
        uuid: 'app1',
        lines: 50,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/applications/app1/logs', { lines: 50 });
      expect(result).toEqual(mockLogs);
    });
  });

  describe('Services', () => {
    it('should handle list_services', async () => {
      const mockServices = [{ uuid: 'svc1', name: 'redis' }];
      vi.mocked(mockClient.get).mockResolvedValue(mockServices);

      const result = await handleTool(mockClient, 'list_services', {});

      expect(mockClient.get).toHaveBeenCalledWith('/services');
      expect(result).toEqual(mockServices);
    });

    it('should handle get_service_logs', async () => {
      // This endpoint doesn't exist in Coolify API - should return error message
      const result = await handleTool(mockClient, 'get_service_logs', { uuid: 'svc1' });

      expect(mockClient.get).not.toHaveBeenCalled();
      expect(result).toHaveProperty('error');
      expect((result as { error: string }).error).toContain('not available');
    });
  });

  describe('Databases', () => {
    it('should handle list_databases', async () => {
      const mockDatabases = [{ uuid: 'db1', name: 'postgres' }];
      vi.mocked(mockClient.get).mockResolvedValue(mockDatabases);

      const result = await handleTool(mockClient, 'list_databases', {});

      expect(mockClient.get).toHaveBeenCalledWith('/databases');
      expect(result).toEqual(mockDatabases);
    });

    it('should handle get_database_logs', async () => {
      // This endpoint doesn't exist in Coolify API - should return error message
      const result = await handleTool(mockClient, 'get_database_logs', { uuid: 'db1', lines: 200 });

      expect(mockClient.get).not.toHaveBeenCalled();
      expect(result).toHaveProperty('error');
      expect((result as { error: string }).error).toContain('not available');
    });
  });

  describe('Unknown tool', () => {
    it('should throw error for unknown tool', async () => {
      await expect(handleTool(mockClient, 'unknown_tool', {})).rejects.toThrow(
        'Unknown tool: unknown_tool'
      );
    });
  });

  describe('Confirmation for dangerous operations', () => {
    it('should execute dangerous operation without confirmation when COOLIFY_REQUIRE_CONFIRM is not set', async () => {
      delete process.env.COOLIFY_REQUIRE_CONFIRM;
      const mockResponse = { message: 'Application stopped' };
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await handleTool(mockClient, 'stop_application', { uuid: 'app1' });

      expect(mockClient.get).toHaveBeenCalledWith('/applications/app1/stop');
      expect(result).toEqual(mockResponse);
    });

    it('should require confirmation when COOLIFY_REQUIRE_CONFIRM is true', async () => {
      process.env.COOLIFY_REQUIRE_CONFIRM = 'true';

      const result = await handleTool(mockClient, 'stop_application', { uuid: 'app1' });

      expect(mockClient.get).not.toHaveBeenCalled();
      expect(result).toHaveProperty('confirmation_required', true);
      expect(result).toHaveProperty('action', 'stop_application');
      expect(result).toHaveProperty('warning');
      expect(result).toHaveProperty('example');
    });

    it('should execute when confirm: true is provided', async () => {
      process.env.COOLIFY_REQUIRE_CONFIRM = 'true';
      const mockResponse = { message: 'Application stopped' };
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await handleTool(mockClient, 'stop_application', { uuid: 'app1', confirm: true });

      expect(mockClient.get).toHaveBeenCalledWith('/applications/app1/stop');
      expect(result).toEqual(mockResponse);
    });

    it('should require confirmation for deploy_application', async () => {
      process.env.COOLIFY_REQUIRE_CONFIRM = 'true';

      const result = await handleTool(mockClient, 'deploy_application', { uuid: 'app1' });

      expect(result).toHaveProperty('confirmation_required', true);
      expect(result).toHaveProperty('action', 'deploy_application');
    });

    it('should require confirmation for execute_command', async () => {
      process.env.COOLIFY_REQUIRE_CONFIRM = 'true';

      const result = await handleTool(mockClient, 'execute_command', { uuid: 'app1', command: 'ls' });

      expect(result).toHaveProperty('confirmation_required', true);
      expect(result).toHaveProperty('action', 'execute_command');
    });

    it('should not require confirmation for read-only operations', async () => {
      process.env.COOLIFY_REQUIRE_CONFIRM = 'true';
      const mockApps = [{ uuid: 'app1' }];
      vi.mocked(mockClient.get).mockResolvedValue(mockApps);

      const result = await handleTool(mockClient, 'list_applications', {});

      expect(mockClient.get).toHaveBeenCalledWith('/applications');
      expect(result).toEqual(mockApps);
    });
  });
});
