# Backend KoulMaghreb - Infrastructure Docker

## 🏗️ Architecture Conforme aux Exigences

### ✅ Exigences Respectées
- **Conteneurs Docker** : Base de données et serveur en conteneurs
- **Proxy Inverse** : Nginx comme seul point d'entrée public
- **Réseau Interne** : Backend et MySQL non exposés publiquement
- **Sécurité** : Seul le proxy inverse est accessible de l'extérieur

### � Services

#### Nginx (Proxy Inverse) - EXPOSÉ PUBLIQUEMENT
- **Ports**: 80:80, 443:443
- **Rôle**: Seul point d'entrée public
- **Fonctions**: Reverse proxy, rate limiting, sécurité

#### Backend Node.js - INTERNE
- **Port**: 3000 (NON exposé)
- **Accès**: Uniquement via le proxy Nginx
- **Auto-initialisation**: Migration et seed automatiques

#### MySQL - INTERNE  
- **Port**: 3306 (NON exposé)
- **Accès**: Uniquement par le backend
- **Données**: Persistantes via volumes Docker

## � Démarrage rapide

### Prérequis
- Docker Desktop installé et démarré
- PowerShell (Windows) ou Bash (Linux/Mac)

### Démarrage
```bash
# Démarrer l'infrastructure complète
.\start-backend.ps1

# Ou manuellement
docker-compose up -d --build
```

### Accès
- **API**: http://localhost/api/
- **Health Check**: http://localhost/api/health
- **Tous les endpoints via le proxy**: http://localhost/api/plats, /api/evenements, etc.

## 📊 Endpoints API (via Proxy)

- `GET /api/health` - Health check
- `GET /api/plats` - Liste des plats
- `GET /api/evenements` - Liste des événements
- `GET /api/articles` - Liste des articles
- `GET /api/utilisateurs` - Liste des utilisateurs (admin)

## 🔒 Sécurité

### Réseau Docker
- **Réseau interne** : `koulmaghreb-network`
- **Isolation** : Backend et MySQL inaccessibles de l'extérieur
- **Communication** : Uniquement entre conteneurs

### Nginx Sécurisé
- Rate limiting (10 req/s)
- Headers de sécurité
- CORS configuré
- Logs détaillés

## 🛠️ Commandes utiles

```bash
# Voir les logs
docker logs koulmaghreb_nginx -f      # Proxy
docker logs koulmaghreb_backend -f    # Backend
docker logs koulmaghreb_mysql -f      # Base de données

# Redémarrer un service
docker-compose restart nginx
docker-compose restart backend
docker-compose restart mysql

# Accéder aux conteneurs
docker exec -it koulmaghreb_nginx sh
docker exec -it koulmaghreb_backend sh
docker exec -it koulmaghreb_mysql mysql -u root -p

# Reconstruire complètement
docker-compose down -v
docker-compose up -d --build
```

## 🔄 Environnements

### Développement
```bash
docker-compose up -d
```

### Production
```bash
# Copier le fichier d'environnement
cp .env.production.example .env.production

# Modifier les valeurs dans .env.production
# Puis démarrer avec la configuration production
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Structure

```
backend/
├── database/           # Scripts de base de données
│   ├── connection.js   # Connexion MySQL
│   ├── migrate.js      # Migration des tables
│   └── seed.js         # Données de test
├── docker-compose.yml  # Configuration Docker développement
├── docker-compose.prod.yml # Configuration Docker production
├── Dockerfile          # Image Docker backend
├── docker-entrypoint.sh # Script d'auto-initialisation
├── start-backend.ps1   # Script de démarrage
├── stop-backend.ps1    # Script d'arrêt
└── .env.production.example # Exemple de configuration production
```

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier les logs
docker logs koulmaghreb_backend

# Vérifier MySQL
docker logs koulmaghreb_mysql

# Redémarrer complètement
docker-compose down && docker-compose up -d
```

### Base de données vide
```bash
# Réinitialiser la base
docker exec -it koulmaghreb_backend node database/migrate.js
docker exec -it koulmaghreb_backend node database/seed.js
```

### Problèmes de port
- MySQL utilise le port 3310 externe pour éviter les conflits
- Backend utilise le port 3000
- Vérifiez qu'aucun autre service n'utilise ces ports

## 🔒 Sécurité

### Production
- Changez tous les mots de passe par défaut
- Utilisez des JWT secrets forts
- Configurez les variables d'environnement appropriées
- Limitez l'accès aux ports MySQL

### Variables à changer
- `DB_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `JWT_SECRET`

## 📊 Monitoring

Les services incluent des health checks automatiques :
- MySQL : ping de connexion
- Backend : endpoint `/api/health`

Status disponible via :
```bash
docker ps
docker-compose ps
```
