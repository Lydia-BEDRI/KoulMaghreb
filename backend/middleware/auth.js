const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await query(
      'SELECT id, email, role, statut FROM utilisateurs WHERE id = ?',
      [decoded.userId]
    );

    if (!user.length) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    if (user[0].statut !== 'Actif') {
      return res.status(401).json({ error: 'Compte suspendu ou inactif' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Accès refusé - Droits administrateur requis' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await query(
        'SELECT id, email, role, statut FROM utilisateurs WHERE id = ?',
        [decoded.userId]
      );

      if (user.length && user[0].statut === 'Actif') {
        req.user = user[0];
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, adminAuth, optionalAuth };
