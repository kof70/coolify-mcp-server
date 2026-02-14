# Endpoints Coolify Non Couverts Actuellement

Dernière mise à jour: 2026-02-14

## Perimetre

Ce document liste les endpoints Coolify encore non exposes par ce MCP server,
ou exposes avec reponse d'erreur car indisponibles dans l'API publique.

## Non exposes dans l'API publique Coolify (outils deja presents)

- `execute_command`
- `get_service_logs`
- `get_database_logs`

## Endpoints encore non implementes dans ce repository

### API Management
- `POST /feedback`
- `GET /enable`
- `GET /disable`

### Cloud Provider Tokens
- `GET /cloud-tokens`
- `POST /cloud-tokens`
- `GET /cloud-tokens/{uuid}`
- `PATCH /cloud-tokens/{uuid}`
- `DELETE /cloud-tokens/{uuid}`
- `POST /cloud-tokens/{uuid}/validate`

### Hetzner
- `GET /hetzner/locations`
- `GET /hetzner/server-types`
- `GET /hetzner/images`
- `GET /hetzner/ssh-keys`
- `POST /servers/hetzner`

### Database Backups avances
- `GET /databases/{uuid}/backups/{scheduled_backup_uuid}/executions`
- `PATCH /databases/{uuid}/backups/{scheduled_backup_uuid}`
- `DELETE /databases/{uuid}/backups/{scheduled_backup_uuid}`
- `DELETE /databases/{uuid}/backups/{scheduled_backup_uuid}/executions/{execution_uuid}`

### Endpoint interne (non recommande)
- `POST /sentinel/push`

## Priorites suggerees

1. Cloud tokens (fort impact pour provisioning automatise)
2. Backups avances (operations de maintenance)
3. Hetzner (cas d'usage infrastructure dedie)
4. API management / feedback (faible criticite)

## Note npm

Le package npm officiel de ce repository est `coolify-mcp-server-kof70`.
