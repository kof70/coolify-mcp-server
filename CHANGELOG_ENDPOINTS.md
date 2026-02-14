# Changelog Endpoints (Etat Actuel)

Dernière mise à jour: 2026-02-14

## Resume

- 89 outils MCP sont definis dans `src/tools/definitions.ts`
- 89 outils sont geres dans `src/tools/handlers.ts`
- Les definitions et handlers sont alignes (aucun outil manquant cote execution)

## Corrections de routes appliquees

- Health check: `/healthcheck` -> `/health`
- Deploy application: `/applications/{uuid}/deploy` -> `/deploy?uuid={uuid}`
- Create environment: `/environments` -> `/projects/{uuid}/environments`
- Create database: endpoints typés par moteur (`/databases/postgresql`, `/databases/mysql`, etc.)
- Requetes `PATCH/POST` nettoyees pour eviter les erreurs 422 (champs `uuid` retires du body quand deja dans l'URL)

## Endpoints declares mais non exposes par Coolify API

- `execute_command`
- `get_service_logs`
- `get_database_logs`

Ces outils retournent une erreur explicite cote MCP au lieu d'un echec implicite.

## Couverture fonctionnelle ajoutee

- CRUD complet sur servers, projects, environments, applications, services, databases
- Variables d'environnement applications/services (single + bulk)
- GitHub Apps (CRUD + repositories + branches)
- Deployments (list, details, cancel)
- Resources aggregate (`list_resources`)
- Confirmation pour operations dangereuses via `COOLIFY_REQUIRE_CONFIRM=true`

## Npm / Distribution

- Package npm officiel de ce repository: `coolify-mcp-server-kof70`
- Setup recommande: `npx coolify-mcp-server-kof70 --setup`
