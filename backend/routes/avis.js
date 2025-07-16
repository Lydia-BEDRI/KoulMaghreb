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

    const platId = req.query.plat_id || '';
    const evenementId = req.query.evenement_id || '';
    const approuve =
        req.query.approuve === 'true'
            ? true
            : req.query.approuve === 'false'
                ? false
                : null;

    let whereClause = '';
    const conditions = [];
    const queryParams = [];

    if (platId) {
      conditions.push('a.plat_id = ?');
      queryParams.push(platId);
    }
    if (evenementId) {
      conditions.push('a.evenement_id = ?');
      queryParams.push(evenementId);
    }

    if (req.user?.role !== 'Admin') {
      conditions.push('a.approuve = true');
    } else if (approuve !== null) {
      conditions.push('a.approuve = ?');
      queryParams.push(approuve);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) AS total FROM avis a ${whereClause}`;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0]?.total || 0;

    const avisQuery = `
      SELECT
        a.id, a.user_id, a.plat_id, a.evenement_id, a.note, a.commentaire, a.approuve, a.created_at,
        u.prenom, u.nom,
        p.nom AS plat_nom,
        e.title AS evenement_titre
      FROM avis a
      LEFT JOIN utilisateurs u ON a.user_id = u.id
      LEFT JOIN plats p ON a.plat_id = p.id
      LEFT JOIN evenements e ON a.evenement_id = e.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const avis = await query(avisQuery, queryParams);

    avis.forEach(item => {
      item.utilisateur = { nom: `${item.prenom} ${item.nom}` };
      if (item.plat_nom) item.plat = { nom: item.plat_nom };
      if (item.evenement_titre) item.evenement = { titre: item.evenement_titre };

      delete item.prenom;
      delete item.nom;
      delete item.plat_nom;
      delete item.evenement_titre;
    });

    res.json({
      avis,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const avisId = parseInt(req.params.id);
    
    const avisQuery = `
      SELECT 
        a.*, 
        u.prenom, u.nom,
        p.nom as plat_nom,
        e.title as evenement_titre
      FROM avis a
      LEFT JOIN utilisateurs u ON a.user_id = u.id
      LEFT JOIN plats p ON a.plat_id = p.id
      LEFT JOIN evenements e ON a.evenement_id = e.id
      WHERE a.id = ?
    `;
    
    const avis = await query(avisQuery, [avisId]);

    if (avis.length === 0) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    const avisItem = avis[0];

    // Vérifier les permissions pour les avis non approuvés
    if (!avisItem.approuve && req.user?.role !== 'Admin' && req.user?.id !== avisItem.user_id) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    // Formater les données
    avisItem.utilisateur = {
      nom: `${avisItem.prenom} ${avisItem.nom}`
    };
    
    if (avisItem.plat_nom) {
      avisItem.plat = { nom: avisItem.plat_nom };
    }
    
    if (avisItem.evenement_titre) {
      avisItem.evenement = { titre: avisItem.evenement_titre };
    }
    
    // Nettoyer les champs
    delete avisItem.prenom;
    delete avisItem.nom;
    delete avisItem.plat_nom;
    delete avisItem.evenement_titre;

    res.json({ avis: avisItem });

  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'avis' });
  }
});

const createValidation = [
  body('plat_id').optional().isInt().withMessage('ID du plat invalide'),
  body('evenement_id').optional().isInt().withMessage('ID de l\'événement invalide'),
  body('note').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('commentaire').optional().trim().isLength({ max: 1000 }).withMessage('Le commentaire ne peut pas dépasser 1000 caractères')
];

router.post('/', auth, createValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plat_id, evenement_id, note, commentaire } = req.body;

    // Vérifier qu'au moins un plat_id ou evenement_id est fourni
    if (!plat_id && !evenement_id) {
      return res.status(400).json({ error: 'Un plat ou un événement doit être spécifié' });
    }

    if (plat_id && evenement_id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas évaluer un plat et un événement en même temps' });
    }

    if (plat_id) {
      const plats = await query('SELECT id FROM plats WHERE id = ?', [plat_id]);
      if (plats.length === 0) {
        return res.status(404).json({ error: 'Plat non trouvé' });
      }
    }

    if (evenement_id) {
      const evenements = await query('SELECT id FROM evenements WHERE id = ?', [evenement_id]);
      if (evenements.length === 0) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }
    }

    let existingAvis;
    if (plat_id) {
      existingAvis = await query(
        'SELECT id FROM avis WHERE user_id = ? AND plat_id = ?',
        [req.user.id, plat_id]
      );
    } else {
      existingAvis = await query(
        'SELECT id FROM avis WHERE user_id = ? AND evenement_id = ?',
        [req.user.id, evenement_id]
      );
    }

    if (existingAvis.length > 0) {
      return res.status(400).json({ error: 'Vous avez déjà donné un avis pour cet élément' });
    }

    const result = await query(
      'INSERT INTO avis (user_id, plat_id, evenement_id, note, commentaire, approuve) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, plat_id || null, evenement_id || null, note, commentaire || null, false]
    );

    if (plat_id) {
      const moyenneResult = await query(
        'SELECT AVG(note) as moyenne FROM avis WHERE plat_id = ? AND approuve = true',
        [plat_id]
      );
      
      const moyenne = moyenneResult[0].moyenne;
      if (moyenne) {
        await query(
          'UPDATE plats SET note = ? WHERE id = ?',
          [parseFloat(moyenne).toFixed(1), plat_id]
        );
      }
    }

    const newAvis = await query('SELECT * FROM avis WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Avis créé avec succès (en attente de modération)',
      avis: newAvis[0]
    });

  } catch (error) {
    console.error('Erreur création avis:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'avis' });
  }
});

const updateValidation = [
  body('note').optional().isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('commentaire').optional().trim().isLength({ max: 1000 }).withMessage('Le commentaire ne peut pas dépasser 1000 caractères'),
  body('approuve').optional().isBoolean().withMessage('Approuvé doit être un booléen')
];

router.put('/:id', auth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const avisId = parseInt(req.params.id);
    const { note, commentaire, approuve } = req.body;

    const existingAvis = await query('SELECT * FROM avis WHERE id = ?', [avisId]);
    if (existingAvis.length === 0) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    const avis = existingAvis[0];

    const isOwner = avis.user_id === req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    if (!isAdmin && approuve !== undefined) {
      return res.status(403).json({ error: 'Vous ne pouvez pas modifier le statut d\'approbation' });
    }

    const updates = [];
    const values = [];

    if (note !== undefined) { updates.push('note = ?'); values.push(note); }
    if (commentaire !== undefined) { updates.push('commentaire = ?'); values.push(commentaire); }
    if (approuve !== undefined && isAdmin) { updates.push('approuve = ?'); values.push(approuve); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = NOW()');
    values.push(avisId);

    await query(
      `UPDATE avis SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if ((note !== undefined || approuve !== undefined) && avis.plat_id) {
      const moyenneResult = await query(
        'SELECT AVG(note) as moyenne FROM avis WHERE plat_id = ? AND approuve = true',
        [avis.plat_id]
      );
      
      const moyenne = moyenneResult[0].moyenne;
      await query(
        'UPDATE plats SET note = ? WHERE id = ?',
        [moyenne ? parseFloat(moyenne).toFixed(1) : 0, avis.plat_id]
      );
    }

    const updatedAvis = await query('SELECT * FROM avis WHERE id = ?', [avisId]);

    res.json({
      message: 'Avis mis à jour avec succès',
      avis: updatedAvis[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour avis:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'avis' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const avisId = parseInt(req.params.id);

    const existingAvis = await query('SELECT * FROM avis WHERE id = ?', [avisId]);
    if (existingAvis.length === 0) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    const avis = existingAvis[0];

    const isOwner = avis.user_id === req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await query('DELETE FROM avis WHERE id = ?', [avisId]);

    if (avis.plat_id) {
      const moyenneResult = await query(
        'SELECT AVG(note) as moyenne FROM avis WHERE plat_id = ? AND approuve = true',
        [avis.plat_id]
      );
      
      const moyenne = moyenneResult[0].moyenne;
      await query(
        'UPDATE plats SET note = ? WHERE id = ?',
        [moyenne ? parseFloat(moyenne).toFixed(1) : 0, avis.plat_id]
      );
    }

    res.json({ message: 'Avis supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression avis:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'avis' });
  }
});

router.get('/stats/overview', auth, adminAuth, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN approuve = true THEN 1 ELSE 0 END) as approuves,
        SUM(CASE WHEN approuve = false THEN 1 ELSE 0 END) as en_attente,
        ROUND(AVG(note), 2) as note_moyenne,
        SUM(CASE WHEN plat_id IS NOT NULL THEN 1 ELSE 0 END) as avis_plats,
        SUM(CASE WHEN evenement_id IS NOT NULL THEN 1 ELSE 0 END) as avis_evenements,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as nouveaux_aujourd_hui
      FROM avis
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Erreur stats avis:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
