const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères'),
  body('prenom').notEmpty().trim().withMessage('Le prénom est requis'),
  body('nom').notEmpty().trim().withMessage('Le nom est requis'),
  body('telephone').optional().matches(/^(0[1-9](\d{8}))$/).withMessage('Numéro de téléphone invalide (format: 0123456789)'),
  body('adresse').optional().trim(),
  body('code_postal').notEmpty().trim().isLength({ min: 5, max: 5 }).isNumeric().withMessage('Le code postal doit contenir exactement 5 chiffres')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password, prenom, nom, telephone, adresse, code_postal } = req.body;

    // Vérifier si l'utilisateur existe déjà - UTILISER query au lieu de connection.execute
    const existingUsers = await query(
      'SELECT id FROM utilisateurs WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur - UTILISER query au lieu de connection.execute
    const result = await query(
      'INSERT INTO utilisateurs (prenom, nom, email, password, telephone, adresse, code_postal) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [prenom, nom, email, hashedPassword, telephone || null, adresse || null, code_postal]
    );

    // Récupérer l'utilisateur créé - UTILISER query au lieu de connection.execute
    const newUsers = await query(
      'SELECT id, prenom, nom, email, telephone, adresse, code_postal, role, statut, date_inscription FROM utilisateurs WHERE id = ?',
      [result.insertId]
    );

    const token = jwt.sign(
      { userId: newUsers[0].id, email: newUsers[0].email },
      process.env.JWT_SECRET || 'votre-secret-jwt',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token,
      user: newUsers[0]
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    });
  }
});

// Connexion
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const users = await query(
      'SELECT id, email, password, prenom, nom, telephone, adresse, code_postal, role, statut FROM utilisateurs WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];

    if (user.statut !== 'Actif') {
      return res.status(401).json({ error: 'Compte suspendu ou inactif' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        telephone: user.telephone,
        adresse: user.adresse,
        code_postal: user.code_postal,
        role: user.role,
        statut: user.statut
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, email, prenom, nom, telephone, adresse, code_postal, role, statut, date_inscription FROM utilisateurs WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;
