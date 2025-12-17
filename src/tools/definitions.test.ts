import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  READ_ONLY_TOOLS,
  DANGEROUS_OPERATIONS,
  getToolDefinitions,
  isReadOnlyMode,
  isConfirmRequired,
  isDangerousOperation,
  getDangerWarning,
} from './definitions.js';

describe('Tool Definitions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('READ_ONLY_TOOLS', () => {
    it('should contain only read operations', () => {
      const writePatterns = ['create_', 'start_', 'stop_', 'restart_', 'deploy_', 'execute_'];

      READ_ONLY_TOOLS.forEach((tool) => {
        const isWriteOperation = writePatterns.some((pattern) => tool.startsWith(pattern));
        expect(isWriteOperation, `${tool} should not be a write operation`).toBe(false);
      });
    });

    it('should include essential monitoring tools', () => {
      const essentialTools = [
        'get_version',
        'health_check',
        'list_servers',
        'list_applications',
        'list_services',
        'list_databases',
        'get_application_logs',
        'get_service_logs',
        'get_database_logs',
      ];

      essentialTools.forEach((tool) => {
        expect(READ_ONLY_TOOLS).toContain(tool);
      });
    });
  });

  describe('isReadOnlyMode', () => {
    it('should return false when COOLIFY_READONLY is not set', () => {
      delete process.env.COOLIFY_READONLY;
      expect(isReadOnlyMode()).toBe(false);
    });

    it('should return false when COOLIFY_READONLY is "false"', () => {
      process.env.COOLIFY_READONLY = 'false';
      expect(isReadOnlyMode()).toBe(false);
    });

    it('should return true when COOLIFY_READONLY is "true"', () => {
      process.env.COOLIFY_READONLY = 'true';
      expect(isReadOnlyMode()).toBe(true);
    });
  });

  describe('getToolDefinitions', () => {
    it('should return all tools when not in read-only mode', () => {
      delete process.env.COOLIFY_READONLY;
      const tools = getToolDefinitions();

      // Should include write operations
      const toolNames = tools.map((t) => t.name);
      expect(toolNames).toContain('create_server');
      expect(toolNames).toContain('start_application');
      expect(toolNames).toContain('deploy_application');
    });

    it('should return only read-only tools when in read-only mode', () => {
      process.env.COOLIFY_READONLY = 'true';
      const tools = getToolDefinitions();

      const toolNames = tools.map((t) => t.name);

      // Should NOT include write operations
      expect(toolNames).not.toContain('create_server');
      expect(toolNames).not.toContain('start_application');
      expect(toolNames).not.toContain('deploy_application');

      // Should include read operations
      expect(toolNames).toContain('list_servers');
      expect(toolNames).toContain('get_application');
    });

    it('should have valid schema for each tool', () => {
      const tools = getToolDefinitions();

      tools.forEach((tool) => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        expect(tool.inputSchema).toHaveProperty('type', 'object');
        expect(tool.inputSchema).toHaveProperty('properties');
        expect(tool.inputSchema).toHaveProperty('required');
      });
    });
  });

  describe('DANGEROUS_OPERATIONS', () => {
    it('should contain destructive operations', () => {
      const expectedDangerous = [
        'stop_application',
        'restart_application',
        'stop_service',
        'restart_service',
        'deploy_application',
        'execute_command',
      ];

      expectedDangerous.forEach((op) => {
        expect(DANGEROUS_OPERATIONS).toContain(op);
      });
    });

    it('should not contain read-only operations', () => {
      DANGEROUS_OPERATIONS.forEach((op) => {
        expect(READ_ONLY_TOOLS).not.toContain(op);
      });
    });
  });

  describe('isConfirmRequired', () => {
    it('should return false when COOLIFY_REQUIRE_CONFIRM is not set', () => {
      delete process.env.COOLIFY_REQUIRE_CONFIRM;
      expect(isConfirmRequired()).toBe(false);
    });

    it('should return false when COOLIFY_REQUIRE_CONFIRM is "false"', () => {
      process.env.COOLIFY_REQUIRE_CONFIRM = 'false';
      expect(isConfirmRequired()).toBe(false);
    });

    it('should return true when COOLIFY_REQUIRE_CONFIRM is "true"', () => {
      process.env.COOLIFY_REQUIRE_CONFIRM = 'true';
      expect(isConfirmRequired()).toBe(true);
    });
  });

  describe('isDangerousOperation', () => {
    it('should return true for dangerous operations', () => {
      expect(isDangerousOperation('stop_application')).toBe(true);
      expect(isDangerousOperation('restart_application')).toBe(true);
      expect(isDangerousOperation('deploy_application')).toBe(true);
      expect(isDangerousOperation('execute_command')).toBe(true);
    });

    it('should return false for safe operations', () => {
      expect(isDangerousOperation('list_applications')).toBe(false);
      expect(isDangerousOperation('get_application')).toBe(false);
      expect(isDangerousOperation('get_version')).toBe(false);
    });
  });

  describe('getDangerWarning', () => {
    it('should return specific warning for known operations', () => {
      expect(getDangerWarning('stop_application')).toContain('stop');
      expect(getDangerWarning('deploy_application')).toContain('deploy');
    });

    it('should return default warning for unknown operations', () => {
      expect(getDangerWarning('unknown_operation')).toContain('dangerous');
    });
  });
});
