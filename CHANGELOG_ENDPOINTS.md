# Résumé des Corrections et Ajouts d'Endpoints

## ✅ Corrections d'Endpoints Existants

1. **Health Check** : `/healthcheck` → `/health` ✅
2. **Create Environment** : `/environments` → `/projects/{uuid}/environments` ✅
3. **Deploy Application** : `/applications/{uuid}/deploy` → `/deploy?uuid={uuid}` ✅
4. **Create Database** : Utilise maintenant les endpoints spécifiques par type (`/databases/postgresql`, `/databases/mysql`, etc.) ✅

## ✅ Endpoints Non Disponibles (Retournent des Erreurs)

- `execute_command` : Non disponible dans l'API Coolify
- `get_service_logs` : Non disponible dans l'API Coolify
- `get_database_logs` : Non disponible dans l'API Coolify

## 🆕 Nouveaux Endpoints Ajoutés

### Servers
- ✅ `get_server` - Obtenir les détails d'un serveur
- ✅ `update_server` - Mettre à jour un serveur
- ✅ `delete_server` - Supprimer un serveur

### Projects
- ✅ `update_project` - Mettre à jour un projet
- ✅ `delete_project` - Supprimer un projet

### Environments
- ✅ `get_environment` - Obtenir les détails d'un environnement
- ✅ `delete_environment` - Supprimer un environnement

### Applications
- ✅ `update_application` - Mettre à jour une application
- ✅ `delete_application` - Supprimer une application
- ✅ `get_application_envs` - Obtenir les variables d'environnement d'une application
- ✅ `create_application_env` - Créer une variable d'environnement pour une application
- ✅ `update_application_env` - Mettre à jour une variable d'environnement d'une application
- ✅ `delete_application_env` - Supprimer une variable d'environnement d'une application
- ✅ `get_application_deployments` - Obtenir tous les déploiements d'une application

### Services
- ✅ `get_service` - Obtenir les détails d'un service
- ✅ `update_service` - Mettre à jour un service
- ✅ `delete_service` - Supprimer un service
- ✅ `get_service_envs` - Obtenir les variables d'environnement d'un service
- ✅ `create_service_env` - Créer une variable d'environnement pour un service
- ✅ `update_service_env` - Mettre à jour une variable d'environnement d'un service
- ✅ `delete_service_env` - Supprimer une variable d'environnement d'un service

### Databases
- ✅ `get_database` - Obtenir les détails d'une base de données
- ✅ `update_database` - Mettre à jour une base de données
- ✅ `delete_database` - Supprimer une base de données
- ✅ `start_database` - Démarrer une base de données
- ✅ `stop_database` - Arrêter une base de données
- ✅ `restart_database` - Redémarrer une base de données
- ✅ `get_database_backups` - Obtenir les configurations de sauvegarde d'une base de données
- ✅ `create_database_backup` - Créer une configuration de sauvegarde pour une base de données

### Deployments
- ✅ `cancel_deployment` - Annuler un déploiement en cours

### Private Keys
- ✅ `get_private_key` - Obtenir les détails d'une clé privée
- ✅ `update_private_key` - Mettre à jour une clé privée
- ✅ `delete_private_key` - Supprimer une clé privée

### Teams
- ✅ `get_team_members` - Obtenir les membres d'une équipe spécifique

### Resources
- ✅ `list_resources` - Lister toutes les ressources (applications, services, bases de données)

## 📊 Statistiques

- **Endpoints corrigés** : 4
- **Nouveaux endpoints ajoutés** : 30+
- **Total d'endpoints disponibles** : ~60+

## 🔒 Opérations Dangereuses

Les opérations suivantes nécessitent une confirmation (`confirm: true`) si `COOLIFY_REQUIRE_CONFIRM=true` :
- Toutes les opérations de suppression (delete_*)
- Toutes les opérations d'arrêt/redémarrage (stop_*, restart_*)
- Les déploiements (deploy_application)
- L'annulation de déploiements (cancel_deployment)

## 📝 Notes

- Tous les endpoints ont été testés pour correspondre aux routes réelles de Coolify
- Les définitions des outils incluent des descriptions détaillées
- Les opérations dangereuses sont marquées et nécessitent confirmation
- Le mode read-only est supporté pour limiter l'accès aux opérations de lecture uniquement


