import axios, { AxiosInstance, AxiosError } from 'axios';
import { CoolifyConfig, CoolifyVersion } from './types.js';

export class CoolifyClient {
  private client: AxiosInstance;
  private version: CoolifyVersion | null = null;

  constructor(config: CoolifyConfig) {
    this.client = axios.create({
      baseURL: `${config.baseUrl.replace(/\/$/, '')}/api/v1`,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        ...(config.teamId && { 'X-Team-Id': config.teamId })
      },
      timeout: 30000
    });

    // Rate limiting interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const message = retryAfter 
            ? `Rate limit exceeded. Retry after ${retryAfter}s.`
            : 'Rate limit exceeded. Please wait.';
          throw new Error(`Coolify API rate limit: ${message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  async detectVersion(): Promise<CoolifyVersion> {
    try {
      const response = await this.client.get('/version');
      const versionString = response.data?.version || response.data?.coolify || 'unknown';
      this.version = this.parseVersion(versionString);
      return this.version;
    } catch {
      // Default fallback version
      this.version = { version: '4.0.0-beta.420', major: 4, minor: 0, patch: 0, beta: 420 };
      return this.version;
    }
  }

  private parseVersion(versionString: string): CoolifyVersion {
    const match = versionString.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?/);
    if (match) {
      return {
        version: versionString,
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3]),
        beta: match[4] ? parseInt(match[4]) : undefined
      };
    }
    return { version: versionString, major: 4, minor: 0, patch: 0, beta: 420 };
  }

  isFeatureAvailable(feature: string): boolean {
    if (!this.version) return true;
    const { beta } = this.version;
    
    switch (feature) {
      case 'execute_command': return beta ? beta >= 400 : true;
      case 'application_logs': return beta ? beta >= 380 : true;
      default: return true;
    }
  }

  getVersion(): CoolifyVersion | null {
    return this.version;
  }

  // Generic request methods
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }
}
