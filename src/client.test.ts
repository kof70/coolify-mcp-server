import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { CoolifyClient } from './client.js';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn().mockResolvedValue({ data: { version: '4.0.0-beta.420' } }),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

describe('CoolifyClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with correct base URL', () => {
      new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'test-token',
      });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://coolify.example.com/api/v1',
        })
      );
    });

    it('should strip trailing slash from base URL', () => {
      new CoolifyClient({
        baseUrl: 'https://coolify.example.com/',
        token: 'test-token',
      });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://coolify.example.com/api/v1',
        })
      );
    });

    it('should include authorization header', () => {
      new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'my-secret-token',
      });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-secret-token',
          }),
        })
      );
    });

    it('should include team ID header when provided', () => {
      new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'test-token',
        teamId: 'team-123',
      });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Team-Id': 'team-123',
          }),
        })
      );
    });

    it('should set timeout to 30 seconds', () => {
      new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'test-token',
      });

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000,
        })
      );
    });
  });

  describe('detectVersion', () => {
    it('should parse version from API response', async () => {
      const client = new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'test-token',
      });

      const version = await client.detectVersion();

      expect(version).toHaveProperty('version');
      expect(version).toHaveProperty('major');
      expect(version).toHaveProperty('minor');
      expect(version).toHaveProperty('patch');
    });
  });

  describe('isFeatureAvailable', () => {
    it('should return true for unknown features', () => {
      const client = new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'test-token',
      });

      expect(client.isFeatureAvailable('unknown_feature')).toBe(true);
    });

    it('should check execute_command availability', async () => {
      const client = new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'test-token',
      });

      await client.detectVersion();
      // With beta.420, execute_command should be available (requires beta.400+)
      expect(client.isFeatureAvailable('execute_command')).toBe(true);
    });

    it('should check application_logs availability', async () => {
      const client = new CoolifyClient({
        baseUrl: 'https://coolify.example.com',
        token: 'test-token',
      });

      await client.detectVersion();
      // With beta.420, application_logs should be available (requires beta.380+)
      expect(client.isFeatureAvailable('application_logs')).toBe(true);
    });
  });
});
