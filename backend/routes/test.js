const express = require('express');
const { query } = require('../database/connection');

const router = express.Router();

// GET /api/test/plats - Endpoint simple pour récupérer les plats
router.get('/plats', async (req, res) => {
  try {
    console.log('🔍 Récupération des plats...');
    
    // Requête simple sans pagination
    const plats = await query('SELECT id, nom, prix, note, image, short_desc, pays, type FROM plats LIMIT 10');
    
    console.log('✅ Plats récupérés:', plats.length);
    
    res.json({
      success: true,
      count: plats.length,
      plats
    });

  } catch (error) {
    console.error('❌ Erreur récupération plats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des plats',
      details: error.message 
    });
  }
});

// GET /api/test/status - Endpoint de test
router.get('/status', async (req, res) => {
  try {
    const result = await query('SELECT COUNT(*) as total FROM plats');
    res.json({
      success: true,
      message: 'Backend connecté à la base de données',
      totalPlats: result[0].total,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Erreur de connexion à la base de données' 
    });
  }
});

module.exports = router;
