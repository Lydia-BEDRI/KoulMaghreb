const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.put('/change-password', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        error: 'Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' 
      });
    }
    
    const users = await query(
      'SELECT id, password FROM utilisateurs WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const user = users[0];
    
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }
    
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await query(
      'UPDATE utilisateurs SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, req.user.id]
    );
    
    res.json({ message: 'Mot de passe mis à jour avec succès' });
    
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
});

router.get('/stats/overview', auth, adminAuth, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'Actif' THEN 1 ELSE 0 END) as actifs,
        SUM(CASE WHEN statut = 'Inactif' THEN 1 ELSE 0 END) as inactifs,
        SUM(CASE WHEN statut = 'Suspendu' THEN 1 ELSE 0 END) as suspendus,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as nouveaux_aujourd_hui,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as nouveaux_30_jours
      FROM utilisateurs 
      WHERE role != 'Admin'
    `);

    const adminStats = await query(`
      SELECT 
        COUNT(*) as total_admins,
        SUM(CASE WHEN statut = 'Actif' THEN 1 ELSE 0 END) as admins_actifs
      FROM utilisateurs 
      WHERE role = 'Admin'
    `);

    res.json({
      ...stats[0],
      total_admins: adminStats[0]?.total_admins || 0,
      admins_actifs: adminStats[0]?.admins_actifs || 0
    });

  } catch (error) {
    console.error('Erreur stats utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const statut = req.query.statut || '';

    let whereClause = 'WHERE role != "Admin"';
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
      whereClause += ' AND ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) as total FROM utilisateurs ${whereClause}`;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0].total;

    const usersQuery = `
      SELECT id, prenom, nom, email, telephone, adresse, code_postal, statut, role, date_inscription, created_at
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
      'SELECT id, prenom, nom, email, telephone, adresse, code_postal, statut, role, date_inscription, created_at FROM utilisateurs WHERE id = ?',
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

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    if (req.user.id !== userId && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    let allowedFields = ['prenom', 'nom', 'telephone', 'adresse', 'code_postal'];
    
    if (req.user.role === 'Admin') {
      allowedFields.push('statut', 'role');
    }
    
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    if (updateData.statut && !['Actif', 'Inactif', 'Suspendu'].includes(updateData.statut)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
    
    if (updateData.role && !['Client', 'Admin'].includes(updateData.role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    if (updateData.role) {
      const currentUser = await query('SELECT role FROM utilisateurs WHERE id = ?', [userId]);
      
      if (currentUser.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      if (currentUser[0].role === 'Admin' && updateData.role !== 'Admin') {
        return res.status(403).json({ 
          error: 'Impossible de rétrograder un administrateur. Contactez un super-admin.' 
        });
      }
      
      if (updateData.role === 'Admin' && currentUser[0].role !== 'Admin') {
        console.warn(`PROMOTION ADMIN: User ${req.user.id} (${req.user.email}) promotes user ${userId} to Admin`);
        
        if (!req.body.confirmAdminPromotion) {
          return res.status(400).json({ 
            error: 'Confirmation requise pour la promotion administrateur',
            confirmRequired: true 
          });
        }
      }
    }

    const fields = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(userId);

    await query(
      `UPDATE utilisateurs SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    const users = await query(
      'SELECT id, email, prenom, nom, telephone, adresse, code_postal, role, statut, date_inscription, created_at FROM utilisateurs WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: users[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
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

module.exports = router;
