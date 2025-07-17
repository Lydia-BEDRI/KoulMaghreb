const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const createTables = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8mb4'
  };

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    
    const dbName = process.env.DB_NAME || 'koulmaghreb_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    await connection.end();
    
    connection = await mysql.createConnection({
      ...dbConfig,
      database: dbName
    });
    
    console.log(`Base de données '${dbName}' créée/connect ok!!!`);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        prenom VARCHAR(100) NOT NULL,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        adresse TEXT,
        code_postal VARCHAR(10) NOT NULL,
        statut ENUM('Actif', 'Inactif', 'Suspendu') DEFAULT 'Actif',
        role ENUM('Client', 'Admin', 'Chef') DEFAULT 'Client',
        date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        image VARCHAR(500),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS plats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        prix DECIMAL(10,2) NOT NULL,
        note DECIMAL(3,2) DEFAULT 0,
        image VARCHAR(500),
        short_desc TEXT,
        long_desc LONGTEXT,
        pays VARCHAR(100),
        type ENUM('Entrée', 'Plat principal', 'Dessert', 'Boisson') DEFAULT 'Plat principal',
        disponible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS evenements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        lieu VARCHAR(255),
        image VARCHAR(500),
        description TEXT,
        short_desc TEXT,
        long_desc LONGTEXT,
        places_total INT DEFAULT 0,
        places_restantes INT DEFAULT 0,
        prix_par_personne DECIMAL(10,2) DEFAULT 0,
        actif BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS commandes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero_commande VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        statut ENUM('En attente', 'En préparation', 'Prête', 'Livrée', 'Annulée') DEFAULT 'En attente',
        notes_admin TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS items_commande (
        id INT AUTO_INCREMENT PRIMARY KEY,
        commande_id INT NOT NULL,
        plat_id INT,
        nom_plat VARCHAR(255) NOT NULL,
        prix DECIMAL(10,2) NOT NULL,
        quantite INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
        FOREIGN KEY (plat_id) REFERENCES plats(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero_reservation VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        evenement_id INT NOT NULL,
        nombre_places INT NOT NULL,
        montant_total DECIMAL(10,2) NOT NULL,
        statut ENUM('En attente', 'Confirmée', 'Annulée') DEFAULT 'En attente',
        notes_admin TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
        FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS avis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plat_id INT,
        evenement_id INT,
        note INT CHECK (note >= 1 AND note <= 5),
        commentaire TEXT,
        approuve BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
        FOREIGN KEY (plat_id) REFERENCES plats(id) ON DELETE CASCADE,
        FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS favoris (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plat_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
        FOREIGN KEY (plat_id) REFERENCES plats(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_plat (user_id, plat_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('tables ont été crées ');

  } catch (error) {
    console.error('erreur:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Migration terminée !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur de migration:', error);
      process.exit(1);
    });
}

module.exports = { createTables };
