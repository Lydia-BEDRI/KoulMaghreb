const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const lieu = req.query.lieu || '';
    const actif = req.query.actif === 'true' ? true : req.query.actif === 'false' ? false : null;
    const upcoming = req.query.upcoming === 'true';

    let whereClause = '';
    let queryParams = [];

    const conditions = [];
    
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (lieu) {
      conditions.push('lieu = ?');
      queryParams.push(lieu);
    }
    
    if (actif !== null) {
      conditions.push('actif = ?');
      queryParams.push(actif);
    }
    
    if (upcoming) {
      conditions.push('date > NOW()');
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) as total FROM evenements ${whereClause}`;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0].total;

    const evenementsQuery = `
      SELECT id, title, date, lieu, image, description, short_desc, long_desc, places_total, places_restantes, prix_par_personne, actif, created_at
      FROM evenements
        ${whereClause}
      ORDER BY date ASC
        LIMIT ${limit} OFFSET ${offset}
    `;
    const evenements = await query(evenementsQuery, queryParams);

    res.json({
      evenements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération événements:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const evenementId = parseInt(req.params.id);
    
    const evenements = await query(
      'SELECT * FROM evenements WHERE id = ?',
      [evenementId]
    );

    if (evenements.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const reservationsResult = await query(
      'SELECT COUNT(*) as nb_reservations, SUM(nombre_places) as places_reservees FROM reservations WHERE evenement_id = ? AND statut = ?',
      [evenementId, 'Confirmée']
    );
    
    const evenement = evenements[0];
    evenement.nb_reservations = reservationsResult[0].nb_reservations || 0;
    evenement.places_reservees = reservationsResult[0].places_reservees || 0;

    res.json({ evenement });

  } catch (error) {
    console.error('Erreur récupération événement:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' });
  }
});

const createValidation = [
  body('title').notEmpty().trim().withMessage('Le titre est requis'),
  body('date').isISO8601().withMessage('Date invalide (format ISO8601 requis)'),
  body('lieu').notEmpty().trim().withMessage('Le lieu est requis'),
  body('description').notEmpty().trim().withMessage('La description est requise'),
  body('short_desc').optional().trim(),
  body('long_desc').optional().trim(),
  body('places_total').isInt({ min: 1 }).withMessage('Le nombre de places doit être un entier positif'),
  body('prix_par_personne').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('image').optional().trim()
];

router.post('/', auth, adminAuth, createValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, date, lieu, description, short_desc, long_desc, places_total, prix_par_personne, image } = req.body;

    const result = await query(
      'INSERT INTO evenements (title, date, lieu, description, short_desc, long_desc, places_total, places_restantes, prix_par_personne, image, actif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, date, lieu, description, short_desc, long_desc, places_total, places_total, prix_par_personne, image, true]
    );

    const newEvenement = await query(
      'SELECT * FROM evenements WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Événement créé avec succès',
      evenement: newEvenement[0]
    });

  } catch (error) {
    console.error('Erreur création événement:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
  }
});

const updateValidation = [
  body('title').optional().notEmpty().trim().withMessage('Le titre ne peut pas être vide'),
  body('date').optional().isISO8601().withMessage('Date invalide (format ISO8601 requis)'),
  body('lieu').optional().notEmpty().trim().withMessage('Le lieu ne peut pas être vide'),
  body('description').optional().notEmpty().trim().withMessage('La description ne peut pas être vide'),
  body('short_desc').optional().trim(),
  body('long_desc').optional().trim(),
  body('places_total').optional().isInt({ min: 1 }).withMessage('Le nombre de places doit être un entier positif'),
  body('places_restantes').optional().isInt({ min: 0 }).withMessage('Le nombre de places restantes doit être un entier positif ou nul'),
  body('prix_par_personne').optional().isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('image').optional().trim(),
  body('actif').optional().isBoolean().withMessage('Actif doit être un booléen')
];

router.put('/:id', auth, adminAuth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const evenementId = parseInt(req.params.id);
    const { title, date, lieu, description, short_desc, long_desc, places_total, places_restantes, prix_par_personne, image, actif } = req.body;

    const existingEvenement = await query('SELECT id FROM evenements WHERE id = ?', [evenementId]);
    if (existingEvenement.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (date !== undefined) { updates.push('date = ?'); values.push(date); }
    if (lieu !== undefined) { updates.push('lieu = ?'); values.push(lieu); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (short_desc !== undefined) { updates.push('short_desc = ?'); values.push(short_desc); }
    if (long_desc !== undefined) { updates.push('long_desc = ?'); values.push(long_desc); }
    if (places_total !== undefined) { updates.push('places_total = ?'); values.push(places_total); }
    if (places_restantes !== undefined) { updates.push('places_restantes = ?'); values.push(places_restantes); }
    if (prix_par_personne !== undefined) { updates.push('prix_par_personne = ?'); values.push(prix_par_personne); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    if (actif !== undefined) { updates.push('actif = ?'); values.push(actif); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = NOW()');
    values.push(evenementId);

    await query(
      `UPDATE evenements SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedEvenement = await query('SELECT * FROM evenements WHERE id = ?', [evenementId]);

    res.json({
      message: 'Événement mis à jour avec succès',
      evenement: updatedEvenement[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour événement:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const evenementId = parseInt(req.params.id);

    const existingEvenement = await query('SELECT id FROM evenements WHERE id = ?', [evenementId]);
    if (existingEvenement.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const reservations = await query(
      'SELECT COUNT(*) as count FROM reservations WHERE evenement_id = ? AND statut = ?',
      [evenementId, 'Confirmée']
    );

    if (reservations[0].count > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer un événement avec des réservations confirmées' 
      });
    }

    await query('DELETE FROM evenements WHERE id = ?', [evenementId]);

    res.json({ message: 'Événement supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression événement:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
  }
});

router.get('/lieux/list', async (req, res) => {
  try {
    const lieux = await query(
      'SELECT DISTINCT lieu FROM evenements WHERE lieu IS NOT NULL ORDER BY lieu'
    );

    res.json({ 
      lieux: lieux.map(l => l.lieu) 
    });

  } catch (error) {
    console.error('Erreur récupération lieux:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lieux' });
  }
});

module.exports = router;
