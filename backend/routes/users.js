const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const statut = req.query.statut || '';

    let whereClause = '';
    let queryParams = [];

    const conditions = [];
    
    if (search) {
      conditions.push('(prenom LIKE ? OR nom LIKE ? OR email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (statut) {
      conditions.push('statut = ?');
      queryParams.push(statut);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) as total FROM utilisateurs ${whereClause}`;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0].total;

    const usersQuery = `
      SELECT id, prenom, nom, email, telephone, adresse, statut, role, date_inscription, created_at
      FROM utilisateurs 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const users = await query(usersQuery, queryParams);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const users = await query(
      'SELECT id, prenom, nom, email, telephone, adresse, statut, role, date_inscription, created_at FROM utilisateurs WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

const updateValidation = [
  body('prenom').optional().notEmpty().trim().withMessage('Le prénom ne peut pas être vide'),
  body('nom').optional().notEmpty().trim().withMessage('Le nom ne peut pas être vide'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
  body('telephone').optional().isMobilePhone('fr-FR').withMessage('Numéro de téléphone invalide'),
  body('statut').optional().isIn(['Actif', 'Inactif', 'Suspendu']).withMessage('Statut invalide'),
  body('role').optional().isIn(['Client', 'Admin', 'Chef']).withMessage('Rôle invalide')
];

router.put('/:id', auth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id);
    const { prenom, nom, email, telephone, adresse, statut, role } = req.body;

    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    if (req.user.role !== 'Admin' && (statut || role)) {
      return res.status(403).json({ error: 'Vous ne pouvez pas modifier le statut ou le rôle' });
    }

    const existingUsers = await query('SELECT id FROM utilisateurs WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (email) {
      const emailExists = await query(
        'SELECT id FROM utilisateurs WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (emailExists.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
    }

    const updates = [];
    const values = [];

    if (prenom !== undefined) { updates.push('prenom = ?'); values.push(prenom); }
    if (nom !== undefined) { updates.push('nom = ?'); values.push(nom); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email); }
    if (telephone !== undefined) { updates.push('telephone = ?'); values.push(telephone); }
    if (adresse !== undefined) { updates.push('adresse = ?'); values.push(adresse); }
    if (statut !== undefined && req.user.role === 'Admin') { updates.push('statut = ?'); values.push(statut); }
    if (role !== undefined && req.user.role === 'Admin') { updates.push('role = ?'); values.push(role); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = NOW()');
    values.push(userId);

    await query(
      `UPDATE utilisateurs SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedUsers = await query(
      'SELECT id, prenom, nom, email, telephone, adresse, statut, role, date_inscription FROM utilisateurs WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUsers[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const existingUsers = await query('SELECT id FROM utilisateurs WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (req.user.id === userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await query('DELETE FROM utilisateurs WHERE id = ?', [userId]);

    res.json({ message: 'Utilisateur supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// /api/users/stats/overview pour admin seulement 
router.get('/stats/overview', auth, adminAuth, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'Actif' THEN 1 ELSE 0 END) as actifs,
        SUM(CASE WHEN statut = 'Inactif' THEN 1 ELSE 0 END) as inactifs,
        SUM(CASE WHEN statut = 'Suspendu' THEN 1 ELSE 0 END) as suspendus,
        SUM(CASE WHEN role = 'Admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN role = 'Client' THEN 1 ELSE 0 END) as clients,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as nouveaux_aujourd_hui,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as nouveaux_30_jours
      FROM utilisateurs
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Erreur stats utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
