const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Fonction pour générer un numéro de commande unique
const generateCommandeNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CMD-${timestamp}${random}`;
};

// GET /api/commandes - Lister les commandes
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const statut = req.query.statut || '';

    let whereClause = '';
    let queryParams = [];

    // Pour les clients, seules leurs commandes
    if (req.user.role === 'Client') {
      whereClause = 'WHERE c.user_id = ?';
      queryParams.push(req.user.id);
    }

    // Filtre par statut
    if (statut) {
      if (whereClause) {
        whereClause += ' AND c.statut = ?';
      } else {
        whereClause = 'WHERE c.statut = ?';
      }
      queryParams.push(statut);
    }

    // Compter le total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM commandes c 
      ${whereClause}
    `;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0].total;

    // Récupérer les commandes avec les infos utilisateur
    const commandesQuery = `
      SELECT 
        c.id, c.numero_commande, c.user_id, c.total, c.statut, c.notes_admin, c.created_at,
        u.prenom, u.nom, u.email, u.telephone
      FROM commandes c
      LEFT JOIN utilisateurs u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const commandes = await query(commandesQuery, [...queryParams, limit, offset]);

    // Récupérer les items pour chaque commande
    for (const commande of commandes) {
      const items = await query(
        'SELECT nom_plat, prix, quantite FROM items_commande WHERE commande_id = ?',
        [commande.id]
      );
      commande.items = items;
      commande.client = {
        nom: `${commande.prenom} ${commande.nom}`,
        email: commande.email,
        telephone: commande.telephone
      };
      // Nettoyer les champs utilisateur du niveau commande
      delete commande.prenom;
      delete commande.nom;
      delete commande.email;
      delete commande.telephone;
    }

    res.json({
      commandes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// GET /api/commandes/:id - Récupérer une commande par son ID
router.get('/:id', auth, async (req, res) => {
  try {
    const commandeId = parseInt(req.params.id);
    
    // Récupérer la commande avec les infos utilisateur
    const commandesQuery = `
      SELECT 
        c.*, 
        u.prenom, u.nom, u.email, u.telephone
      FROM commandes c
      LEFT JOIN utilisateurs u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    
    const commandes = await query(commandesQuery, [commandeId]);

    if (commandes.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const commande = commandes[0];

    // Vérifier les permissions
    if (req.user.role === 'Client' && commande.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Récupérer les items de la commande
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
    
    // Nettoyer les champs utilisateur
    delete commande.prenom;
    delete commande.nom;
    delete commande.email;
    delete commande.telephone;

    res.json({ commande });

  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
});

// POST /api/commandes - Créer une nouvelle commande
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
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;

    // Calculer le total
    const total = items.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

    // Générer un numéro de commande unique
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

    // Créer la commande
    const result = await query(
      'INSERT INTO commandes (numero_commande, user_id, total, statut) VALUES (?, ?, ?, ?)',
      [numeroCommande, req.user.id, total, 'En attente']
    );

    const commandeId = result.insertId;

    // Ajouter les items
    for (const item of items) {
      await query(
        'INSERT INTO items_commande (commande_id, plat_id, nom_plat, prix, quantite) VALUES (?, ?, ?, ?, ?)',
        [commandeId, item.plat_id || null, item.nom_plat, item.prix, item.quantite]
      );
    }

    // Récupérer la commande créée
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
    console.error('Erreur création commande:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

// PUT /api/commandes/:id - Mettre à jour une commande (Admin seulement pour le statut)
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

    // Vérifier si la commande existe
    const existingCommande = await query('SELECT * FROM commandes WHERE id = ?', [commandeId]);
    if (existingCommande.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const commande = existingCommande[0];

    // Vérifier les permissions
    if (req.user.role === 'Client') {
      if (commande.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Accès refusé' });
      }
      // Les clients ne peuvent que annuler leurs commandes (si pas encore en préparation)
      if (statut && statut !== 'Annulée') {
        return res.status(403).json({ error: 'Vous ne pouvez que annuler vos commandes' });
      }
      if (statut === 'Annulée' && !['En attente'].includes(commande.statut)) {
        return res.status(400).json({ error: 'Impossible d\'annuler une commande déjà en cours de traitement' });
      }
    }

    // Construire la requête de mise à jour
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
    console.error('Erreur mise à jour commande:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande' });
  }
});

// GET /api/commandes/stats/overview - Statistiques des commandes (Admin seulement)
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
    console.error('Erreur stats commandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
