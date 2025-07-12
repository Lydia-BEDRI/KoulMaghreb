# Frontend Docker Configuration

Ce dossier contient la configuration Docker pour le frontend Vue.js de KoulMaghreb.

## Structure des fichiers Docker

- `Dockerfile` : Dockerfile de production avec build multi-stage
- `Dockerfile.dev` : Dockerfile pour le développement
- `docker-compose.yml` : Configuration Docker Compose pour la production
- `docker-compose.dev.yml` : Configuration Docker Compose pour le développement
- `nginx.conf` : Configuration Nginx pour servir l'application en production
- `.dockerignore` : Fichiers à ignorer lors du build Docker

## Commandes Docker

### Développement

Pour démarrer l'application en mode développement avec hot-reload :

```bash
# Construire et démarrer les conteneurs
docker-compose -f docker-compose.dev.yml up --build

# Démarrer en arrière-plan
docker-compose -f docker-compose.dev.yml up -d --build

# Arrêter les conteneurs
docker-compose -f docker-compose.dev.yml down

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

L'application sera accessible sur : http://localhost:5174

### Production

Pour construire et démarrer l'application en mode production :

```bash
# Construire et démarrer les conteneurs
docker-compose up --build

# Démarrer en arrière-plan
docker-compose up -d --build

# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f frontend
```

L'application sera accessible sur : http://localhost:3000

### Commandes Docker natives

Si vous préférez utiliser Docker directement :

```bash
# Build de l'image de production
docker build -t koulmaghreb-frontend .

# Run du conteneur de production
docker run -p 3000:80 koulmaghreb-frontend

# Build de l'image de développement
docker build -f Dockerfile.dev -t koulmaghreb-frontend-dev .

# Run du conteneur de développement
docker run -p 5173:5173 -v ${PWD}:/app -v /app/node_modules koulmaghreb-frontend-dev
```

## Fonctionnalités

### Dockerfile de production

- **Multi-stage build** : Optimisation de la taille de l'image finale
- **Nginx** : Serveur web léger et performant
- **Gzip compression** : Compression des assets pour améliorer les performances
- **Cache headers** : Mise en cache des ressources statiques
- **Security headers** : Headers de sécurité HTTP
- **SPA routing** : Support du routing côté client

### Dockerfile de développement

- **Hot reload** : Rechargement automatique des modifications
- **Volume mapping** : Synchronisation des fichiers locaux
- **Port forwarding** : Accès depuis l'hôte

## Configuration

### Variables d'environnement

Vous pouvez créer un fichier `.env` pour configurer votre application :

```env
NODE_ENV=production
VITE_API_URL=http://localhost:8000
```

### Nginx

La configuration Nginx inclut :

- Gestion du routing SPA
- Compression Gzip
- Cache des assets statiques
- Headers de sécurité
- Gestion des erreurs

## Bonnes pratiques

1. **Utilisez le mode développement** pour le développement local
2. **Utilisez le mode production** pour les déploiements
3. **Adaptez les ports** selon votre environnement
4. **Configurez les variables d'environnement** selon vos besoins
5. **Surveillez les logs** pour détecter les erreurs

## Dépannage

### Problèmes courants

1. **Port déjà utilisé** : Changez les ports dans les fichiers docker-compose
2. **Permissions** : Vérifiez les permissions des fichiers sous Windows
3. **Hot reload ne fonctionne pas** : Activez le polling dans la config Vite
4. **Build échoue** : Vérifiez les dépendances dans package.json

### Commandes utiles

```bash
# Nettoyer les conteneurs
docker system prune -f

# Voir les conteneurs en cours
docker ps

# Entrer dans un conteneur
docker exec -it <container-name> sh

# Rebuild complet
docker-compose build --no-cache
```
