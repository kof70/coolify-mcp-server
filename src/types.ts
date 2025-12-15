// Configuration
export interface CoolifyConfig {
  baseUrl: string;
  token: string;
  teamId?: string;
}

// Version detection
export interface CoolifyVersion {
  version: string;
  major: number;
  minor: number;
  patch: number;
  beta?: number;
}

// API Response types
export interface Team {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Server {
  uuid: string;
  name: string;
  description?: string;
  ip: string;
  port: number;
  user: string;
  is_build_server: boolean;
  is_reachable: boolean;
  is_usable: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  uuid: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  environments?: Environment[];
}

export interface Environment {
  uuid: string;
  name: string;
  project_uuid: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  uuid: string;
  name: string;
  description?: string;
  fqdn?: string;
  git_repository?: string;
  git_branch?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  uuid: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  uuid: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  uuid: string;
  status: string;
  created_at: string;
  updated_at: string;
  application_uuid?: string;
  service_uuid?: string;
}

export interface PrivateKey {
  uuid: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Tool input schemas
export interface UuidInput {
  uuid: string;
}

export interface CreateServerInput {
  name: string;
  description?: string;
  ip: string;
  port?: number;
  user?: string;
  private_key_uuid: string;
  is_build_server?: boolean;
  instant_validate?: boolean;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface CreateEnvironmentInput {
  project_uuid: string;
  name: string;
}

export interface CreateApplicationInput {
  project_uuid: string;
  environment_name: string;
  environment_uuid?: string;
  git_repository?: string;
  ports_exposes?: string;
  destination_uuid: string;
}

export interface CreateServiceInput {
  type: string;
  name: string;
  project_uuid: string;
  environment_name: string;
  server_uuid: string;
  destination_uuid?: string;
}

export interface CreateDatabaseInput {
  name: string;
  type: string;
  project_uuid: string;
  environment_name: string;
  server_uuid: string;
}

export interface CreatePrivateKeyInput {
  name: string;
  description?: string;
  private_key: string;
}

export interface ExecuteCommandInput {
  uuid: string;
  command: string;
}

export interface GetLogsInput {
  uuid: string;
  lines?: number;
}

export interface DeployInput {
  uuid?: string;
  tag?: string;
  force?: boolean;
}
