# Analyse Endpoints Coolify vs MCP Server

Dernière mise à jour: 2026-02-14

## Methodologie

Source de verite utilisee:
- `src/tools/definitions.ts` (outils exposes)
- `src/tools/handlers.ts` (execution reelle)

Verification effectuee:
- 89 outils definis
- 89 outils geres
- 0 ecart definitions/handlers

## Endpoints / Outils couverts

### Core
- 2 outils: version + health

### Teams
- 5 outils: list/get/current/current members/team members

### Servers
- 8 outils: list/create/get/update/delete/validate/resources/domains

### Projects & Environments
- 9 outils: list/get/create/update/delete project + list/get/create/delete environment

### Applications
- 24 outils: CRUD, start/stop/restart, deploy, logs, env vars (single + bulk), deployments, modes de creation (public/private github app/private deploy key/dockerfile/dockerimage/dockercompose)

### Services
- 14 outils: CRUD, start/stop/restart, env vars (single + bulk), logs (non expose par Coolify)

### Databases
- 11 outils: list/get/create/update/delete/start/stop/restart/backups + logs (non expose par Coolify)

### Deployments
- 3 outils: list/get/cancel

### Private Keys
- 5 outils: list/get/create/update/delete

### GitHub Apps
- 7 outils: list/get/create/update/delete + repositories + branches

### Resources
- 1 outil: list_resources

## Limitations connues (cote API Coolify)

Ces outils existent cote MCP mais retournent volontairement une erreur descriptive car l'API Coolify ne fournit pas ces endpoints:
- `execute_command`
- `get_service_logs`
- `get_database_logs`

## Conclusion

La couche MCP est globalement complete pour les endpoints publics majeurs de Coolify utilises en production.
Les ecarts restants concernent surtout des APIs specialisees (cloud tokens, Hetzner, backup executions detaillees, endpoints internes).
