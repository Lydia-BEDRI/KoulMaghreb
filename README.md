# KoulMaghreb - Plateforme Culinaire Maghrébine

KoulMaghreb est une plateforme web dédiée à la découverte, la commande et la réservation autour de la cuisine du Maghreb (Maroc, Algérie, Tunisie).  
Ce projet a été réalisé dans le cadre du module **Projet Annuel** de la 4ème année d’ingénierie du web à l’ESGI.

---

## Description

KoulMaghreb permet aux utilisateurs de :
- Découvrir un catalogue de plats maghrébins
- Commander des plats en ligne
- Réserver des places pour des événements culinaires
- Gérer leur panier, favoris et avis
- Accéder à un espace personnel pour suivre commandes et réservations
- Profiter d’un espace d’administration (pour les admins)

---

## Fonctionnalités principales

- **Catalogue de plats** : navigation, recherche, filtres par pays/type
- **Commande en ligne** : panier, validation, historique
- **Réservations d’événements** : calendrier, réservation, gestion
- **Gestion des utilisateurs** : inscription, connexion, profil, modification
- **Favoris et avis** : ajout/suppression, notation, commentaires
- **Espace admin** : gestion des plats, utilisateurs, événements, statistiques
- **SEO optimisé** : balises dynamiques, Open Graph, meta description
- **Sécurité** : authentification JWT, gestion des rôles, headers de sécurité

---

## Technologies utilisées

- **Frontend** : Vue 3, Vite, TailwindCSS, Vue Router, Vue Toastification
- **Backend** : Node.js, Express, MySQL, JWT, Docker, Nginx (reverse proxy)
- **DevOps** : Docker Compose, multi-stage build, scripts de migration/seed
- **Autres** : API RESTful, gestion des variables d’environnement, SPA

---

## Lancer le projet en développement

### Prérequis

- Node.js (v16+)
- npm ou yarn
- Docker & Docker Compose (pour la stack complète)
- MySQL (si utilisation locale sans Docker)

### 1. Cloner le dépôt

```bash
git clone https://github.com/Lydia-BEDRI/KoulMaghreb
cd KoulMaghreb
```

### 2. Lancer le backend et la base de données

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
*Ou avec Docker :*
```bash
docker-compose up -d --build
```

### 3. Lancer le frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 4. Accéder à l’application

- Frontend : [http://localhost:5173](http://localhost:5173)
- Backend API : [http://localhost:3000/api](http://localhost:3000/api)

---

## Mise en production

La plateforme est déployée en production à l’adresse suivante :

- **Frontend** : [https://koul-maghreb.vercel.app/nos-plats](https://koul-maghreb.vercel.app/nos-plats)
- **Backend API** : [https://koulmaghrebbackend-production.up.railway.app/](https://koulmaghrebbackend-production.up.railway.app/)

---

## Informations complémentaires

- Ce projet est réalisé dans le cadre du module **Projet Annuel** de la 4ème année d’ingénierie du web à l’ESGI.
- Pour toute question, contactez l’équipe aux adresses : <lbedri@myges.fr>, <nbouzidia@myges.fr>, <maitouli@myges.fr>

