const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

const generateCommandeNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CMD-${timestamp}${random}`;
};

router.get('/', auth, async (req, res) => {
  try {
    const statut = req.query.statut || '';
    const userId = req.user.id || req.user.userId;

    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }

    let whereClause = 'WHERE c.user_id = ?';
    let params = [userId];

    if (statut) {
      whereClause += ' AND c.statut = ?';
      params.push(statut);
    }

    const commandesQuery = `
      SELECT 
        c.id, c.numero_commande, c.user_id, c.total, c.statut, c.notes_admin, c.created_at,
        u.prenom, u.nom, u.email, u.telephone
      FROM commandes c
      LEFT JOIN utilisateurs u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
    `;
    
    const commandes = await query(commandesQuery, params);

    for (const commande of commandes) {
      try {
        const items = await query(
          'SELECT nom_plat, prix, quantite FROM items_commande WHERE commande_id = ?',
          [commande.id]
        );
        commande.items = items;
      } catch (itemError) {
        commande.items = [];
      }
      
      if (commande.prenom && commande.nom) {
        commande.client = {
          nom: `${commande.prenom} ${commande.nom}`,
          email: commande.email,
          telephone: commande.telephone
        };
      }
      
      delete commande.prenom;
      delete commande.nom;
      delete commande.email;
      delete commande.telephone;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = commandes.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCommandes = commandes.slice(startIndex, endIndex);

    const response = {
      commandes: paginatedCommandes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    res.json(response);

  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des commandes',
      details: error.message
    });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const commandeId = parseInt(req.params.id);
    
    if (!commandeId || isNaN(commandeId)) {
      return res.status(400).json({ error: 'ID de commande invalide' });
    }
    
    let commandesQuery = `
      SELECT 
        c.*, 
        u.prenom, u.nom, u.email, u.telephone
      FROM commandes c
      LEFT JOIN utilisateurs u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    
    let queryParams = [commandeId];
    
    if (req.user.role === 'Client') {
      commandesQuery += ' AND c.user_id = ?';
      queryParams.push(req.user.id);
    }
    
    const commandes = await query(commandesQuery, queryParams);

    if (commandes.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const commande = commandes[0];

    const items = await query(
      'SELECT nom_plat, prix, quantite FROM items_commande WHERE commande_id = ?',
      [commandeId]
    );

    commande.items = items;
    commande.client = {
      nom: `${commande.prenom} ${commande.nom}`,
      email: commande.email,
      telephone: commande.telephone
    };
    
    delete commande.prenom;
    delete commande.nom;
    delete commande.email;
    delete commande.telephone;

    res.json({ commande });

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
});

const createValidation = [
  body('items').isArray({ min: 1 }).withMessage('Au moins un item est requis'),
  body('items.*.plat_id').optional().isInt().withMessage('ID du plat invalide'),
  body('items.*.nom_plat').notEmpty().trim().withMessage('Nom du plat requis'),
  body('items.*.prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('items.*.quantite').isInt({ min: 1 }).withMessage('Quantité invalide')
];

router.post('/', auth, createValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { items } = req.body;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.nom_plat || !item.prix || !item.quantite) {
        return res.status(400).json({ 
          error: `Item ${i + 1} invalide`,
          details: 'nom_plat, prix et quantite sont requis'
        });
      }
      
      if (item.plat_id) {
        const platExiste = await query('SELECT id FROM plats WHERE id = ?', [item.plat_id]);
        
        if (platExiste.length === 0) {
          item.plat_id = null;
        }
      }
      
      if (isNaN(parseFloat(item.prix)) || parseFloat(item.prix) <= 0) {
        return res.status(400).json({ 
          error: `Prix invalide pour l'article "${item.nom_plat}"`,
          details: 'Le prix doit être un nombre positif'
        });
      }
      
      if (isNaN(parseInt(item.quantite)) || parseInt(item.quantite) <= 0) {
        return res.status(400).json({ 
          error: `Quantité invalide pour l'article "${item.nom_plat}"`,
          details: 'La quantité doit être un nombre entier positif'
        });
      }
    }

    const total = items.reduce((sum, item) => {
      const prix = parseFloat(item.prix);
      const quantite = parseInt(item.quantite);
      return sum + (prix * quantite);
    }, 0);

    let numeroCommande;
    let attempts = 0;
    do {
      numeroCommande = generateCommandeNumber();
      
      const existing = await query('SELECT id FROM commandes WHERE numero_commande = ?', [numeroCommande]);
      if (existing.length === 0) break;
      attempts++;
      
    } while (attempts < 10);

    if (attempts >= 10) {
      return res.status(500).json({ error: 'Impossible de générer un numéro de commande unique' });
    }

    const result = await query(
      'INSERT INTO commandes (numero_commande, user_id, total, statut) VALUES (?, ?, ?, ?)',
      [numeroCommande, req.user.id, total, 'En attente']
    );

    const commandeId = result.insertId;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const platId = item.plat_id || null;

      try {
        await query(
          'INSERT INTO items_commande (commande_id, plat_id, nom_plat, prix, quantite) VALUES (?, ?, ?, ?, ?)',
          [commandeId, platId, item.nom_plat, parseFloat(item.prix), parseInt(item.quantite)]
        );
      } catch (itemError) {
        throw itemError;
      }
    }

    const newCommande = await query(
      'SELECT * FROM commandes WHERE id = ?',
      [commandeId]
    );

    const commandeItems = await query(
      'SELECT nom_plat, prix, quantite FROM items_commande WHERE commande_id = ?',
      [commandeId]
    );

    const commande = newCommande[0];
    commande.items = commandeItems;

    res.status(201).json({
      message: 'Commande créée avec succès',
      commande
    });

  } catch (error) {
    let errorMessage = 'Erreur lors de la création de la commande';
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Table de base de données manquante';
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorMessage = 'Erreur de structure de base de données';
    } else if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = 'Numéro de commande en conflit';
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      errorMessage = 'Erreur de référence de données - plat inexistant';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const updateValidation = [
  body('statut').optional().isIn(['En attente', 'En préparation', 'Prête', 'Livrée', 'Annulée']).withMessage('Statut invalide'),
  body('notes_admin').optional().trim()
];

router.put('/:id', auth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const commandeId = parseInt(req.params.id);
    const { statut, notes_admin } = req.body;

    const existingCommande = await query('SELECT * FROM commandes WHERE id = ?', [commandeId]);
    if (existingCommande.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const commande = existingCommande[0];

    if (req.user.role === 'Client') {
      if (commande.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Accès refusé' });
      }
      if (statut && statut !== 'Annulée') {
        return res.status(403).json({ error: 'Vous ne pouvez que annuler vos commandes' });
      }
      if (statut === 'Annulée' && !['En attente'].includes(commande.statut)) {
        return res.status(400).json({ error: 'Impossible d\'annuler une commande déjà en cours de traitement' });
      }
    }

    const updates = [];
    const values = [];

    if (statut !== undefined) { updates.push('statut = ?'); values.push(statut); }
    if (notes_admin !== undefined && req.user.role === 'Admin') { 
      updates.push('notes_admin = ?'); 
      values.push(notes_admin); 
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = NOW()');
    values.push(commandeId);

    await query(
      `UPDATE commandes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedCommande = await query('SELECT * FROM commandes WHERE id = ?', [commandeId]);

    res.json({
      message: 'Commande mise à jour avec succès',
      commande: updatedCommande[0]
    });

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande' });
  }
});

router.get('/stats/overview', auth, adminAuth, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'En attente' THEN 1 ELSE 0 END) as en_attente,
        SUM(CASE WHEN statut = 'En préparation' THEN 1 ELSE 0 END) as en_preparation,
        SUM(CASE WHEN statut = 'Prête' THEN 1 ELSE 0 END) as prete,
        SUM(CASE WHEN statut = 'Livrée' THEN 1 ELSE 0 END) as livree,
        SUM(CASE WHEN statut = 'Annulée' THEN 1 ELSE 0 END) as annulee,
        ROUND(AVG(total), 2) as panier_moyen,
        SUM(CASE WHEN statut = 'Livrée' THEN total ELSE 0 END) as chiffre_affaires,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as nouvelles_aujourd_hui
      FROM commandes
    `);

    res.json(stats[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
