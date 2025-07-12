const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/plats - Lister tous les plats (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const pays = req.query.pays || '';
    const type = req.query.type || '';
    const disponible = req.query.disponible === 'true' ? true : req.query.disponible === 'false' ? false : null;

    let whereClause = '';
    let queryParams = [];

    // Construire la clause WHERE pour les filtres
    const conditions = [];
    
    if (search) {
      conditions.push('(nom LIKE ? OR short_desc LIKE ? OR long_desc LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (pays) {
      conditions.push('pays = ?');
      queryParams.push(pays);
    }
    
    if (type) {
      conditions.push('type = ?');
      queryParams.push(type);
    }
    
    if (disponible !== null) {
      conditions.push('disponible = ?');
      queryParams.push(disponible);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Compter le total
    const countQuery = `SELECT COUNT(*) as total FROM plats ${whereClause}`;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0].total;

    // Récupérer les plats
    const platsQuery = `
      SELECT id, nom, prix, note, image, short_desc, pays, type, disponible, created_at
      FROM plats 
      ${whereClause}
      ORDER BY nom ASC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const plats = await query(platsQuery, queryParams);

    res.json({
      plats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération plats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des plats' });
  }
});

// GET /api/plats/:id - Récupérer un plat par son ID (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const platId = parseInt(req.params.id);
    
    const plats = await query(
      'SELECT * FROM plats WHERE id = ?',
      [platId]
    );

    if (plats.length === 0) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    // Si l'utilisateur est connecté, récupérer ses avis sur ce plat
    let userAvis = null;
    if (req.user) {
      const avisResult = await query(
        'SELECT note, commentaire FROM avis WHERE user_id = ? AND plat_id = ?',
        [req.user.id, platId]
      );
      userAvis = avisResult[0] || null;
    }

    // Récupérer la moyenne des notes et le nombre d'avis
    const statsResult = await query(
      'SELECT AVG(note) as moyenne, COUNT(*) as nb_avis FROM avis WHERE plat_id = ? AND approuve = true',
      [platId]
    );
    
    const stats = statsResult[0];
    const plat = plats[0];
    
    plat.note_moyenne = stats.moyenne ? parseFloat(stats.moyenne).toFixed(1) : null;
    plat.nb_avis = stats.nb_avis;
    plat.user_avis = userAvis;

    res.json({ plat });

  } catch (error) {
    console.error('Erreur récupération plat:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du plat' });
  }
});

// POST /api/plats - Créer un nouveau plat (Admin seulement)
const createValidation = [
  body('nom').notEmpty().trim().withMessage('Le nom du plat est requis'),
  body('prix').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('short_desc').notEmpty().trim().withMessage('La description courte est requise'),
  body('long_desc').optional().trim(),
  body('pays').notEmpty().trim().withMessage('Le pays d\'origine est requis'),
  body('type').isIn(['Entrée', 'Plat principal', 'Dessert', 'Boisson']).withMessage('Type de plat invalide'),
  body('image').optional().trim(),
  body('disponible').optional().isBoolean().withMessage('Disponible doit être un booléen')
];

router.post('/', auth, adminAuth, createValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prix, short_desc, long_desc, pays, type, image, disponible = true } = req.body;

    const result = await query(
      'INSERT INTO plats (nom, prix, short_desc, long_desc, pays, type, image, disponible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, prix, short_desc, long_desc, pays, type, image, disponible]
    );

    const newPlat = await query(
      'SELECT * FROM plats WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Plat créé avec succès',
      plat: newPlat[0]
    });

  } catch (error) {
    console.error('Erreur création plat:', error);
    res.status(500).json({ error: 'Erreur lors de la création du plat' });
  }
});

// PUT /api/plats/:id - Mettre à jour un plat (Admin seulement)
const updateValidation = [
  body('nom').optional().notEmpty().trim().withMessage('Le nom du plat ne peut pas être vide'),
  body('prix').optional().isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('short_desc').optional().notEmpty().trim().withMessage('La description courte ne peut pas être vide'),
  body('long_desc').optional().trim(),
  body('pays').optional().notEmpty().trim().withMessage('Le pays d\'origine ne peut pas être vide'),
  body('type').optional().isIn(['Entrée', 'Plat principal', 'Dessert', 'Boisson']).withMessage('Type de plat invalide'),
  body('image').optional().trim(),
  body('disponible').optional().isBoolean().withMessage('Disponible doit être un booléen')
];

router.put('/:id', auth, adminAuth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const platId = parseInt(req.params.id);
    const { nom, prix, short_desc, long_desc, pays, type, image, disponible } = req.body;

    // Vérifier si le plat existe
    const existingPlat = await query('SELECT id FROM plats WHERE id = ?', [platId]);
    if (existingPlat.length === 0) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    // Construire la requête de mise à jour
    const updates = [];
    const values = [];

    if (nom !== undefined) { updates.push('nom = ?'); values.push(nom); }
    if (prix !== undefined) { updates.push('prix = ?'); values.push(prix); }
    if (short_desc !== undefined) { updates.push('short_desc = ?'); values.push(short_desc); }
    if (long_desc !== undefined) { updates.push('long_desc = ?'); values.push(long_desc); }
    if (pays !== undefined) { updates.push('pays = ?'); values.push(pays); }
    if (type !== undefined) { updates.push('type = ?'); values.push(type); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    if (disponible !== undefined) { updates.push('disponible = ?'); values.push(disponible); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = NOW()');
    values.push(platId);

    await query(
      `UPDATE plats SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedPlat = await query('SELECT * FROM plats WHERE id = ?', [platId]);

    res.json({
      message: 'Plat mis à jour avec succès',
      plat: updatedPlat[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour plat:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du plat' });
  }
});

// DELETE /api/plats/:id - Supprimer un plat (Admin seulement)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const platId = parseInt(req.params.id);

    const existingPlat = await query('SELECT id FROM plats WHERE id = ?', [platId]);
    if (existingPlat.length === 0) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    await query('DELETE FROM plats WHERE id = ?', [platId]);

    res.json({ message: 'Plat supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression plat:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du plat' });
  }
});

// GET /api/plats/pays/list - Lister tous les pays (public)
router.get('/pays/list', async (req, res) => {
  try {
    const pays = await query(
      'SELECT DISTINCT pays FROM plats WHERE pays IS NOT NULL ORDER BY pays'
    );

    res.json({ 
      pays: pays.map(p => p.pays) 
    });

  } catch (error) {
    console.error('Erreur récupération pays:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des pays' });
  }
});

// GET /api/plats/types/list - Lister tous les types (public)
router.get('/types/list', async (req, res) => {
  try {
    const types = await query(
      'SELECT DISTINCT type FROM plats WHERE type IS NOT NULL ORDER BY type'
    );

    res.json({ 
      types: types.map(t => t.type) 
    });

  } catch (error) {
    console.error('Erreur récupération types:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des types' });
  }
});

module.exports = router;
