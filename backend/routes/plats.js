const express = require('express');
const { query } = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Route pour récupérer tous les plats (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const type = req.query.type || '';
    const cuisine = req.query.cuisine || '';

    let whereClause = 'WHERE statut = "Actif"';
    let params = [];

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    if (cuisine) {
      whereClause += ' AND cuisine = ?';
      params.push(cuisine);
    }

    // Compter le total
    const countQuery = `SELECT COUNT(*) as total FROM plats ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = countResult[0].total;

    // Récupérer les plats avec pagination
    const platsQuery = `
      SELECT id, nom, description, prix, image_url, type, cuisine, statut, created_at
      FROM plats 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const plats = await query(platsQuery, params);

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

// Route pour récupérer un plat par ID (public)
router.get('/:id', async (req, res) => {
  try {
    const platId = req.params.id;

    const plats = await query(
      'SELECT * FROM plats WHERE id = ? AND statut = "Actif"',
      [platId]
    );

    if (plats.length === 0) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    res.json({ plat: plats[0] });

  } catch (error) {
    console.error('Erreur récupération plat:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du plat' });
  }
});

// Route admin pour récupérer tous les plats (avec ceux inactifs)
router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    const statut = req.query.statut || '';
    const type = req.query.type || '';
    const cuisine = req.query.cuisine || '';

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (statut) {
      whereClause += ' AND statut = ?';
      params.push(statut);
    }

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    if (cuisine) {
      whereClause += ' AND cuisine = ?';
      params.push(cuisine);
    }

    // Compter le total
    const countQuery = `SELECT COUNT(*) as total FROM plats ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = countResult[0].total;

    // Récupérer les plats avec pagination
    const platsQuery = `
      SELECT * FROM plats 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const plats = await query(platsQuery, params);

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
    console.error('Erreur récupération plats admin:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des plats',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route admin pour créer un plat
router.post('/admin', auth, adminAuth, async (req, res) => {
  try {
    const {
      nom,
      description,
      prix,
      image_url,
      type,
      cuisine,
      statut = 'Actif'
    } = req.body;

    // Validation
    if (!nom || !description || !prix || !type || !cuisine) {
      return res.status(400).json({
        error: 'Données manquantes: nom, description, prix, type et cuisine sont requis'
      });
    }

    const result = await query(`
      INSERT INTO plats (nom, description, prix, image_url, type, cuisine, statut)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nom, description, prix, image_url, type, cuisine, statut]);

    // Récupérer le plat créé
    const nouveauPlat = await query(
      'SELECT * FROM plats WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Plat créé avec succès',
      plat: nouveauPlat[0]
    });

  } catch (error) {
    console.error('Erreur création plat:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du plat',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route admin pour mettre à jour un plat
router.put('/admin/:id', auth, adminAuth, async (req, res) => {
  try {
    const platId = req.params.id;
    const {
      nom,
      description,
      prix,
      image_url,
      type,
      cuisine,
      statut
    } = req.body;

    // Vérifier que le plat existe
    const platExistant = await query('SELECT * FROM plats WHERE id = ?', [platId]);
    
    if (platExistant.length === 0) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    // Construire la requête de mise à jour
    const updates = [];
    const params = [];

    if (nom !== undefined) { updates.push('nom = ?'); params.push(nom); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (prix !== undefined) { updates.push('prix = ?'); params.push(prix); }
    if (image_url !== undefined) { updates.push('image_url = ?'); params.push(image_url); }
    if (type !== undefined) { updates.push('type = ?'); params.push(type); }
    if (cuisine !== undefined) { updates.push('cuisine = ?'); params.push(cuisine); }
    if (statut !== undefined) { updates.push('statut = ?'); params.push(statut); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(platId);

    await query(`
      UPDATE plats 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `, params);

    // Récupérer le plat mis à jour
    const platMisAJour = await query('SELECT * FROM plats WHERE id = ?', [platId]);

    res.json({
      message: 'Plat mis à jour avec succès',
      plat: platMisAJour[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour plat:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du plat',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route admin pour supprimer un plat (soft delete)
router.delete('/admin/:id', auth, adminAuth, async (req, res) => {
  try {
    const platId = req.params.id;

    // Vérifier que le plat existe
    const platExistant = await query('SELECT * FROM plats WHERE id = ?', [platId]);
    
    if (platExistant.length === 0) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    // Soft delete - marquer comme inactif
    await query(
      'UPDATE plats SET statut = "Inactif", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [platId]
    );

    res.json({
      message: 'Plat supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression plat:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du plat',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
