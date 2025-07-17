const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { testConnection } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de sécurité
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parsing JSON et URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware pour les uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/plats', require('./routes/plats'));
app.use('/api/evenements', require('./routes/evenements'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/avis', require('./routes/avis'));
app.use('/api/test', require('./routes/test'));
const favorisRouter = require('./routes/favoris');
app.use('/api/favoris', favorisRouter);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API KoulMaghreb opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion d'erreur global
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ 
      error: 'Format JSON invalide' 
    });
  }
  
  res.status(error.status || 500).json({
    error: error.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    method: req.method,
    url: req.originalUrl
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Serveur démarré sans connexion DB');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('💥 Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
