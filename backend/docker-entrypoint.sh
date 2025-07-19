set -e

# Attendre que MySQL soit disponible
echo "Attente de MySQL..."
until nc -z mysql 3306; do
  echo "MySQL n'est pas encore disponible - attente..."
  sleep 2
done

echo "MySQL est disponible - démarrage du backend..."
exec npm start