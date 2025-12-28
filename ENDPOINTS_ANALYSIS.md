# Analyse des Endpoints Coolify vs MCP Server

## Endpoints Implémentés ✅

### Version & Health
- ✅ GET /version
- ✅ GET /health

### Teams
- ✅ GET /teams
- ✅ GET /teams/current
- ✅ GET /teams/current/members
- ✅ GET /teams/{id}

### Projects
- ✅ GET /projects
- ✅ GET /projects/{uuid}
- ✅ POST /projects
- ✅ GET /projects/{uuid}/environments
- ✅ POST /projects/{uuid}/environments

### Servers
- ✅ GET /servers
- ✅ POST /servers
- ✅ GET /servers/{uuid}/domains
- ✅ GET /servers/{uuid}/resources
- ✅ GET /servers/{uuid}/validate

### Applications
- ✅ GET /applications
- ✅ GET /applications/{uuid}
- ✅ POST /applications (générique)
- ✅ GET /applications/{uuid}/start
- ✅ GET /applications/{uuid}/stop
- ✅ GET /applications/{uuid}/restart
- ✅ GET /applications/{uuid}/logs
- ✅ GET /deploy (via deploy_application)

### Services
- ✅ GET /services
- ✅ POST /services
- ✅ GET /services/{uuid}/start
- ✅ GET /services/{uuid}/stop
- ✅ GET /services/{uuid}/restart

### Databases
- ✅ GET /databases
- ✅ POST /databases/{type} (tous types)

### Deployments
- ✅ GET /deployments
- ✅ GET /deployments/{uuid}

### Private Keys
- ✅ GET /security/keys
- ✅ POST /security/keys

## Endpoints Manquants ❌

### Teams
- ❌ GET /teams/{id}/members

### Projects
- ❌ PATCH /projects/{uuid}
- ❌ DELETE /projects/{uuid}
- ❌ GET /projects/{uuid}/{environment_name_or_uuid}
- ❌ DELETE /projects/{uuid}/environments/{environment_name_or_uuid}

### Servers
- ❌ GET /servers/{uuid}
- ❌ PATCH /servers/{uuid}
- ❌ DELETE /servers/{uuid}

### Applications
- ❌ PATCH /applications/{uuid}
- ❌ DELETE /applications/{uuid}
- ❌ GET /applications/{uuid}/envs
- ❌ POST /applications/{uuid}/envs
- ❌ PATCH /applications/{uuid}/envs/bulk
- ❌ PATCH /applications/{uuid}/envs
- ❌ DELETE /applications/{uuid}/envs/{env_uuid}
- ❌ POST /applications/public
- ❌ POST /applications/private-github-app
- ❌ POST /applications/private-deploy-key
- ❌ POST /applications/dockerfile
- ❌ POST /applications/dockerimage
- ❌ POST /applications/dockercompose

### Services
- ❌ GET /services/{uuid}
- ❌ PATCH /services/{uuid}
- ❌ DELETE /services/{uuid}
- ❌ GET /services/{uuid}/envs
- ❌ POST /services/{uuid}/envs
- ❌ PATCH /services/{uuid}/envs/bulk
- ❌ PATCH /services/{uuid}/envs
- ❌ DELETE /services/{uuid}/envs/{env_uuid}

### Databases
- ❌ GET /databases/{uuid}
- ❌ PATCH /databases/{uuid}
- ❌ DELETE /databases/{uuid}
- ❌ GET /databases/{uuid}/start
- ❌ GET /databases/{uuid}/stop
- ❌ GET /databases/{uuid}/restart
- ❌ GET /databases/{uuid}/backups
- ❌ POST /databases/{uuid}/backups
- ❌ GET /databases/{uuid}/backups/{scheduled_backup_uuid}/executions
- ❌ PATCH /databases/{uuid}/backups/{scheduled_backup_uuid}
- ❌ DELETE /databases/{uuid}/backups/{scheduled_backup_uuid}
- ❌ DELETE /databases/{uuid}/backups/{scheduled_backup_uuid}/executions/{execution_uuid}

### Deployments
- ❌ POST /deployments/{uuid}/cancel
- ❌ GET /deployments/applications/{uuid}

### Private Keys
- ❌ GET /security/keys/{uuid}
- ❌ PATCH /security/keys/{uuid}
- ❌ DELETE /security/keys/{uuid}

### Cloud Provider Tokens
- ❌ GET /cloud-tokens
- ❌ POST /cloud-tokens
- ❌ GET /cloud-tokens/{uuid}
- ❌ PATCH /cloud-tokens/{uuid}
- ❌ DELETE /cloud-tokens/{uuid}
- ❌ POST /cloud-tokens/{uuid}/validate

### GitHub Apps
- ❌ GET /github-apps
- ❌ POST /github-apps
- ❌ PATCH /github-apps/{github_app_id}
- ❌ DELETE /github-apps/{github_app_id}
- ❌ GET /github-apps/{github_app_id}/repositories
- ❌ GET /github-apps/{github_app_id}/repositories/{owner}/{repo}/branches

### Hetzner
- ❌ GET /hetzner/locations
- ❌ GET /hetzner/server-types
- ❌ GET /hetzner/images
- ❌ GET /hetzner/ssh-keys
- ❌ POST /servers/hetzner

### Resources
- ❌ GET /resources



