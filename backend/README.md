# API KoulMaghreb - Backend

Backend Node.js/Express pour la plateforme culinaire maghrébine KoulMaghreb.

## 🚀 Installation et démarrage

### Prérequis
- Node.js (v16 ou plus récent)
- MySQL (v8.0 ou plus récent)
- Git

### 1. Installation des dépendances
```bash
cd backend
npm install
```

### 2. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos paramètres
```

### 3. Configuration de la base de données
Assurez-vous que MySQL est en cours d'exécution et créez un utilisateur si nécessaire.

Variables d'environnement importantes :
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=koulmaghreb_db
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_jwt_secret_super_secure
```

### 4. Création de la base de données et des tables
```bash
# Créer les tables
npm run db:migrate

# Insérer les données de test
npm run db:seed
```

### 5. Démarrage du serveur
```bash
# Mode développement avec rechargement automatique
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
backend/
├── database/
│   ├── connection.js     # Configuration de la connexion MySQL
│   ├── migrate.js        # Scripts de création des tables
│   └── seed.js          # Données de test
├── middleware/
│   └── auth.js          # Middleware d'authentification JWT
├── routes/
│   ├── auth.js          # Routes d'authentification
│   ├── users.js         # Gestion des utilisateurs
│   ├── articles.js      # Articles de blog
│   ├── plats.js         # Catalogue des plats
│   ├── evenements.js    # Événements et soirées
│   ├── commandes.js     # Commandes clients
│   ├── reservations.js  # Réservations d'événements
│   └── avis.js          # Avis et commentaires
├── uploads/             # Dossier pour les fichiers uploadés
├── .env.example         # Template de configuration
├── package.json
└── server.js           # Point d'entrée de l'application
```

## 🛠️ API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (Admin)
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Modification d'un utilisateur
- `DELETE /api/users/:id` - Suppression d'un utilisateur (Admin)
- `GET /api/users/stats/overview` - Statistiques (Admin)

### Articles
- `GET /api/articles` - Liste des articles (public)
- `GET /api/articles/:slug` - Détails d'un article (public)
- `POST /api/articles` - Créer un article (Admin)
- `PUT /api/articles/:id` - Modifier un article (Admin)
- `DELETE /api/articles/:id` - Supprimer un article (Admin)
- `GET /api/articles/categories/list` - Liste des catégories

### Plats
- `GET /api/plats` - Catalogue des plats (public)
- `GET /api/plats/:id` - Détails d'un plat (public)
- `POST /api/plats` - Créer un plat (Admin)
- `PUT /api/plats/:id` - Modifier un plat (Admin)
- `DELETE /api/plats/:id` - Supprimer un plat (Admin)
- `GET /api/plats/pays/list` - Liste des pays
- `GET /api/plats/types/list` - Liste des types

### Événements
- `GET /api/evenements` - Liste des événements (public)
- `GET /api/evenements/:id` - Détails d'un événement (public)
- `POST /api/evenements` - Créer un événement (Admin)
- `PUT /api/evenements/:id` - Modifier un événement (Admin)
- `DELETE /api/evenements/:id` - Supprimer un événement (Admin)
- `GET /api/evenements/lieux/list` - Liste des lieux

### Commandes
- `GET /api/commandes` - Liste des commandes
- `GET /api/commandes/:id` - Détails d'une commande
- `POST /api/commandes` - Créer une commande
- `PUT /api/commandes/:id` - Modifier une commande
- `GET /api/commandes/stats/overview` - Statistiques (Admin)

### Réservations
- `GET /api/reservations` - Liste des réservations
- `GET /api/reservations/:id` - Détails d'une réservation
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `GET /api/reservations/stats/overview` - Statistiques (Admin)

### Avis
- `GET /api/avis` - Liste des avis
- `GET /api/avis/:id` - Détails d'un avis
- `POST /api/avis` - Créer un avis
- `PUT /api/avis/:id` - Modifier un avis
- `DELETE /api/avis/:id` - Supprimer un avis
- `GET /api/avis/stats/overview` - Statistiques (Admin)

## 🔒 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. 

### Utilisation
1. Connectez-vous via `POST /api/auth/login`
2. Récupérez le token dans la réponse
3. Incluez le token dans les headers des requêtes suivantes :
   ```
   Authorization: Bearer <votre_token>
   ```

### Rôles utilisateur
- **Client** : Accès limité aux ressources publiques et à ses propres données
- **Admin** : Accès complet à toutes les fonctionnalités
- **Chef** : Accès spécialisé (à implémenter selon les besoins)

## 📊 Base de données

### Tables principales
- `utilisateurs` - Comptes utilisateur
- `articles` - Articles de blog
- `plats` - Catalogue des plats
- `evenements` - Événements et soirées
- `commandes` - Commandes clients
- `items_commande` - Articles dans une commande
- `reservations` - Réservations d'événements
- `avis` - Avis et commentaires

### Relations
- Un utilisateur peut avoir plusieurs commandes et réservations
- Une commande contient plusieurs items
- Une réservation est liée à un événement
- Les avis peuvent porter sur un plat ou un événement

## 🔧 Scripts NPM

- `npm start` - Démarrer en mode production
- `npm run dev` - Démarrer en mode développement
- `npm run db:migrate` - Créer les tables
- `npm run db:seed` - Insérer les données de test
- `npm test` - Lancer les tests (à implémenter)

## 🚀 Déploiement

### Variables d'environnement de production
```env
NODE_ENV=production
DB_HOST=votre_host_db
DB_NAME=votre_db_prod
DB_USER=votre_user_prod
DB_PASSWORD=votre_password_secure
JWT_SECRET=votre_jwt_secret_super_secure_et_long
FRONTEND_URL=https://votre-domaine.com
```

### Sécurité
- Utilisez HTTPS en production
- Configurez un reverse proxy (Nginx recommandé)
- Limitez les CORS aux domaines autorisés
- Utilisez des mots de passe forts pour la base de données
- Surveillez les logs d'erreur

## 📞 Support

Pour toute question ou problème :
- Consultez les logs du serveur
- Vérifiez la connexion à la base de données
- Assurez-vous que toutes les variables d'environnement sont configurées

---

**KoulMaghreb Team** - Plateforme culinaire maghrébine
