# Collection Postman - KoulMaghreb API

## Variables globales
- **base_url** : `http://localhost:3000`
- **token** : (sera défini après login)

## 🔐 Tests d'authentification

### 1. Connexion Admin
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@koulmaghreb.com",
  "password": "admin123"
}
```

### 2. Connexion Client
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "amine.djerad@email.com",
  "password": "password123"
}
```

### 3. Profil utilisateur (avec token)
```
GET {{base_url}}/api/auth/me
Authorization: Bearer {{token}}
```

## 📚 Tests des ressources publiques

### 4. Liste des articles
```
GET {{base_url}}/api/articles
```

### 5. Détail d'un article
```
GET {{base_url}}/api/articles/couscous-roi-des-plats
```

### 6. Catalogue des plats
```
GET {{base_url}}/api/plats
```

### 7. Filtrer les plats par pays
```
GET {{base_url}}/api/plats?pays=Maroc
```

### 8. Événements à venir
```
GET {{base_url}}/api/evenements?upcoming=true
```

## 🛒 Tests des commandes (nécessite authentification)

### 9. Créer une commande
```
POST {{base_url}}/api/commandes
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "items": [
    {
      "plat_id": 1,
      "nom_plat": "Couscous Royal",
      "prix": 18.00,
      "quantite": 2
    },
    {
      "plat_id": 2,
      "nom_plat": "Tajine de Poulet",
      "prix": 16.00,
      "quantite": 1
    }
  ]
}
```

### 10. Mes commandes
```
GET {{base_url}}/api/commandes
Authorization: Bearer {{token}}
```

## 🎫 Tests des réservations

### 11. Créer une réservation
```
POST {{base_url}}/api/reservations
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "evenement_id": 1,
  "nombre_places": 2
}
```

### 12. Mes réservations
```
GET {{base_url}}/api/reservations
Authorization: Bearer {{token}}
```

## ⭐ Tests des avis

### 13. Donner un avis sur un plat
```
POST {{base_url}}/api/avis
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "plat_id": 1,
  "note": 5,
  "commentaire": "Excellent couscous, très authentique !"
}
```

### 14. Voir les avis d'un plat
```
GET {{base_url}}/api/avis?plat_id=1
```

## 👑 Tests Admin (nécessite token admin)

### 15. Liste des utilisateurs
```
GET {{base_url}}/api/users
Authorization: Bearer {{admin_token}}
```

### 16. Créer un nouveau plat
```
POST {{base_url}}/api/plats
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "nom": "Pastilla au Poulet",
  "prix": 22.00,
  "short_desc": "Délicieuse pastilla marocaine au poulet et aux amandes",
  "long_desc": "La pastilla est un plat traditionnel marocain...",
  "pays": "Maroc",
  "type": "Plat principal",
  "image": "/images/pastilla.jpg"
}
```

### 17. Approuver un avis
```
PUT {{base_url}}/api/avis/1
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "approuve": true
}
```

### 18. Statistiques globales
```
GET {{base_url}}/api/users/stats/overview
Authorization: Bearer {{admin_token}}
```

## 🔍 Tests de filtrage et pagination

### 19. Articles avec pagination
```
GET {{base_url}}/api/articles?page=1&limit=5
```

### 20. Plats par type
```
GET {{base_url}}/api/plats?type=Dessert
```

### 21. Recherche dans les articles
```
GET {{base_url}}/api/articles?search=couscous
```

---

**Note**: Remplacez {{token}} et {{admin_token}} par les vrais tokens obtenus lors de la connexion.
