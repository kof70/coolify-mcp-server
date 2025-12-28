# Endpoints Coolify Non Couverts Actuellement

## 📋 Liste Complète des Endpoints Manquants

### 🔧 API Management
- ❌ `POST /feedback` - Envoyer des commentaires (endpoint public)
- ❌ `GET /enable` - Activer l'API
- ❌ `GET /disable` - Désactiver l'API

### 📦 Applications - Types de Création Spécialisés
- ❌ `POST /applications/public` - Créer une application publique
- ❌ `POST /applications/private-github-app` - Créer une application avec GitHub App privé
- ❌ `POST /applications/private-deploy-key` - Créer une application avec clé de déploiement privée
- ❌ `POST /applications/dockerfile` - Créer une application depuis un Dockerfile
- ❌ `POST /applications/dockerimage` - Créer une application depuis une image Docker
- ❌ `POST /applications/dockercompose` - Créer une application depuis Docker Compose

### 🔐 Applications - Variables d'Environnement
- ❌ `PATCH /applications/{uuid}/envs/bulk` - Mettre à jour plusieurs variables d'environnement en masse

### ☁️ Cloud Provider Tokens (6 endpoints)
- ❌ `GET /cloud-tokens` - Lister les tokens de fournisseurs cloud
- ❌ `POST /cloud-tokens` - Créer un token de fournisseur cloud
- ❌ `GET /cloud-tokens/{uuid}` - Obtenir un token de fournisseur cloud
- ❌ `PATCH /cloud-tokens/{uuid}` - Mettre à jour un token de fournisseur cloud
- ❌ `DELETE /cloud-tokens/{uuid}` - Supprimer un token de fournisseur cloud
- ❌ `POST /cloud-tokens/{uuid}/validate` - Valider un token de fournisseur cloud

### 🐙 GitHub Apps (6 endpoints)
- ❌ `GET /github-apps` - Lister les GitHub Apps
- ❌ `POST /github-apps` - Créer une GitHub App
- ❌ `PATCH /github-apps/{github_app_id}` - Mettre à jour une GitHub App
- ❌ `DELETE /github-apps/{github_app_id}` - Supprimer une GitHub App
- ❌ `GET /github-apps/{github_app_id}/repositories` - Obtenir les dépôts d'une GitHub App
- ❌ `GET /github-apps/{github_app_id}/repositories/{owner}/{repo}/branches` - Obtenir les branches d'un dépôt

### 🖥️ Hetzner (5 endpoints)
- ❌ `GET /hetzner/locations` - Obtenir les emplacements Hetzner disponibles
- ❌ `GET /hetzner/server-types` - Obtenir les types de serveurs Hetzner
- ❌ `GET /hetzner/images` - Obtenir les images Hetzner disponibles
- ❌ `GET /hetzner/ssh-keys` - Obtenir les clés SSH Hetzner
- ❌ `POST /servers/hetzner` - Créer un serveur Hetzner

### 🗄️ Databases - Backups Avancés (4 endpoints)
- ❌ `GET /databases/{uuid}/backups/{scheduled_backup_uuid}/executions` - Obtenir les exécutions d'une sauvegarde planifiée
- ❌ `PATCH /databases/{uuid}/backups/{scheduled_backup_uuid}` - Mettre à jour une configuration de sauvegarde
- ❌ `DELETE /databases/{uuid}/backups/{scheduled_backup_uuid}` - Supprimer une configuration de sauvegarde
- ❌ `DELETE /databases/{uuid}/backups/{scheduled_backup_uuid}/executions/{execution_uuid}` - Supprimer une exécution de sauvegarde

### 🔧 Services - Variables d'Environnement
- ❌ `PATCH /services/{uuid}/envs/bulk` - Mettre à jour plusieurs variables d'environnement en masse

### 📡 Sentinel (Endpoint Interne)
- ❌ `POST /sentinel/push` - Endpoint interne pour les mises à jour de serveur (non recommandé pour usage externe)

## 📊 Statistiques

- **Total d'endpoints manquants** : ~30 endpoints
- **Endpoints critiques manquants** : 
  - Types de création d'applications spécialisés (6)
  - Cloud Provider Tokens (6)
  - GitHub Apps (6)
  - Hetzner (5)
  - Gestion avancée des backups (4)

## 🎯 Priorité d'Implémentation Suggérée

### Priorité Haute 🔴
1. **Types de création d'applications** - Nécessaires pour créer différents types d'applications
2. **Cloud Provider Tokens** - Utiles pour l'intégration avec les fournisseurs cloud
3. **Bulk envs updates** - Améliore l'efficacité de gestion des variables d'environnement

### Priorité Moyenne 🟡
4. **GitHub Apps** - Utile pour l'intégration GitHub
5. **Hetzner** - Utile si utilisation de Hetzner comme fournisseur

### Priorité Basse 🟢
6. **Backups avancés** - Fonctionnalités avancées de gestion des backups
7. **API Management** - Enable/disable API (peu utilisé)

## 📝 Notes

- Les endpoints Sentinel sont internes et ne devraient généralement pas être exposés
- Les endpoints de feedback sont publics et peuvent être utiles pour le support
- Les endpoints Hetzner sont spécifiques à ce fournisseur cloud

