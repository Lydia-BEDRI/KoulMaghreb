const express = require('express');
const { query } = require('../database/connection');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    
    const userId = req.user.id || req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const favoris = await query(
      `SELECT f.*, p.nom, p.prix, p.image, p.type, p.pays, p.note
       FROM favoris f
       LEFT JOIN plats p ON f.plat_id = p.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
    res.json({ favoris });
  } catch (error) {
    console.error('Erreur favoris:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des favoris' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { plat_id } = req.body;
    const userId = req.user.id || req.user.userId;
    
    if (!plat_id) {
      return res.status(400).json({ error: 'ID du plat requis' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    await query(
      'INSERT INTO favoris (user_id, plat_id) VALUES (?, ?)',
      [userId, plat_id]
    );

    res.json({ message: 'Plat ajouté aux favoris' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Ce plat est déjà dans vos favoris' });
    } else {
      console.error('Erreur ajout favori:', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris' });
    }
  }
});

router.delete('/:platId', auth, async (req, res) => {
  try {
    const { platId } = req.params;
    const userId = req.user.id || req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
    
    await query(
      'DELETE FROM favoris WHERE user_id = ? AND plat_id = ?',
      [userId, platId]
    );

    res.json({ message: 'Plat supprimé des favoris' });
  } catch (error) {
    console.error('Erreur suppression favori:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

module.exports = router;