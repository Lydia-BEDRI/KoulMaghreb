const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { testConnection } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3001; 
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
const allowedOrigins = ['http://localhost', 'http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman, curl etc.
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware pour les uploads
app.use('/uploads', express.static('uploads'));

// Configuration de la confiance des proxys
app.set('trust proxy', 1);

// Routes
const authRoutes = require('./routes/auth');
const platRoutes = require('./routes/plats');
const userRoutes = require('./routes/users');
const articlesRoutes = require('./routes/articles');
const commandesRoutes = require('./routes/commandes');
const evenementsRoutes = require('./routes/evenements');
const reservationsRoutes = require('./routes/reservations');
const avisRoutes = require('./routes/avis');
const favorisRoutes = require('./routes/favoris');
const panierRoutes = require('./routes/panier');
const adminDashboardRoutes = require('./routes/adminDashboard');

app.use('/api/auth', authRoutes);
app.use('/api/plats', platRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/commandes', commandesRoutes);
app.use('/api/evenements', evenementsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/favoris', favorisRoutes);
app.use('/api/panier', panierRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

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
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('Serveur démarré sans connexion DB');
    }
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('💥 Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
