#!/bin/sh
set -e

echo "Attente de MySQL..."
until nc -z mysql 3306; do
  echo "MySQL n'est pas encore disponible - attente..."
  sleep 2
done

echo "MySQL est disponible, lancement des migrations..."
npm run db:migrate || echo "Migration déjà appliquée ?"

echo "Insertion des données initiales..."
npm run db:seed || echo "Seed déjà appliqué ?"

echo "Démarrage du backend..."
exec npm start