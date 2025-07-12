# 🚀 Guide de démarrage rapide - Backend KoulMaghreb

## Étapes pour démarrer votre backend

### 1. 📦 Installation des dépendances
```powershell
cd backend
npm install
```

### 2. 🗄️ Configuration de MySQL
Assurez-vous que MySQL est installé et en cours d'exécution sur votre machine.

**Créer la base de données :**
```sql
CREATE DATABASE koulmaghreb_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. ⚙️ Configuration de l'environnement
Le fichier `.env` est déjà créé avec les paramètres par défaut. 
**Modifiez le mot de passe MySQL si nécessaire :**
```env
DB_PASSWORD=votre_mot_de_passe_mysql
```

### 4. 🏗️ Création des tables et données de test
```powershell
# Créer toutes les tables
npm run db:migrate

# Insérer les données de démonstration
npm run db:seed
```

### 5. 🚀 Démarrage du serveur
```powershell
# Mode développement (rechargement automatique)
npm run dev
```

Le serveur sera disponible sur `http://localhost:3000`

### 6. ✅ Test de fonctionnement
Ouvrez votre navigateur et allez sur :
- `http://localhost:3000/api/health` - Vérifier que l'API fonctionne
- `http://localhost:3000/api/articles` - Voir les articles (public)
- `http://localhost:3000/api/plats` - Voir le catalogue des plats (public)

## 👤 Comptes de test créés

### Compte Admin
- **Email :** admin@koulmaghreb.com
- **Mot de passe :** admin123
- **Rôle :** Admin (accès complet)

### Comptes Clients
- **Email :** amine.djerad@email.com / **Mot de passe :** password123
- **Email :** yasmine.z@email.com / **Mot de passe :** password123

## 🔧 Commandes utiles

```powershell
# Démarrer en mode développement
npm run dev

# Démarrer en mode production
npm start

# Recréer la base de données
npm run db:migrate
npm run db:seed

# Voir les logs en temps réel
# (les logs s'affichent directement dans la console)
```

## 🌐 Endpoints principaux

### Authentification
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/register` - S'inscrire
- `GET /api/auth/me` - Profil (avec token)

### Ressources publiques
- `GET /api/articles` - Articles de blog
- `GET /api/plats` - Catalogue des plats
- `GET /api/evenements` - Événements à venir

### Admin (nécessite authentification Admin)
- `GET /api/users` - Gestion des utilisateurs
- `POST /api/plats` - Ajouter un plat
- `POST /api/evenements` - Créer un événement

## 🔑 Utilisation de l'authentification

### 1. Se connecter
```javascript
POST /api/auth/login
{
  "email": "admin@koulmaghreb.com",
  "password": "admin123"
}
```

### 2. Utiliser le token
```javascript
// Dans les headers des requêtes suivantes
Authorization: Bearer <token_reçu>
```

## ❗ Problèmes courants

### Erreur de connexion MySQL
- Vérifiez que MySQL est démarré
- Vérifiez les identifiants dans le fichier `.env`
- Assurez-vous que la base de données existe

### Port déjà utilisé
- Changez le port dans `.env` : `PORT=3001`
- Ou arrêtez l'application qui utilise le port 3000

### Erreur de migration
- Vérifiez que MySQL est accessible
- Supprimez la base de données et recréez-la
- Relancez `npm run db:migrate`

## 🎯 Prochaines étapes

Une fois le backend fonctionnel :
1. Testez les endpoints avec Postman ou votre frontend
2. Personnalisez les données de démonstration
3. Ajoutez vos propres plats et événements
4. Configurez l'upload d'images
5. Déployez sur votre serveur de production

**Votre backend KoulMaghreb est prêt ! 🎉**
