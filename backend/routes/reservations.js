const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

const generateReservationNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RSV-${timestamp}${random}`;
};

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const statut = req.query.statut || '';

    let whereClause = '';
    let queryParams = [];

    if (req.user.role === 'Client') {
      whereClause = 'WHERE r.user_id = ?';
      queryParams.push(req.user.id);
    }

    if (statut) {
      if (whereClause) {
        whereClause += ' AND r.statut = ?';
      } else {
        whereClause = 'WHERE r.statut = ?';
      }
      queryParams.push(statut);
    }

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM reservations r 
      ${whereClause}
    `;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0].total;

    const reservationsQuery = `
      SELECT 
        r.id, r.numero_reservation, r.user_id, r.evenement_id, r.nombre_places, 
        r.montant_total, r.statut, r.notes_admin, r.created_at,
        u.prenom, u.nom, u.email, u.telephone,
        e.title as evenement_titre, e.date as evenement_date, e.lieu as evenement_lieu
      FROM reservations r
      LEFT JOIN utilisateurs u ON r.user_id = u.id
      LEFT JOIN evenements e ON r.evenement_id = e.id
      ${whereClause}
      ORDER BY r.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const reservations = await query(reservationsQuery, [...queryParams, limit, offset]);

    reservations.forEach(reservation => {
      reservation.client = {
        nom: `${reservation.prenom} ${reservation.nom}`,
        email: reservation.email,
        telephone: reservation.telephone
      };
      reservation.evenement = {
        id: reservation.evenement_id,
        titre: reservation.evenement_titre,
        date: reservation.evenement_date,
        lieu: reservation.evenement_lieu
      };
      
      delete reservation.prenom;
      delete reservation.nom;
      delete reservation.email;
      delete reservation.telephone;
      delete reservation.evenement_titre;
      delete reservation.evenement_date;
      delete reservation.evenement_lieu;
    });

    res.json({
      reservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération réservations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id);
    
    const reservationsQuery = `
      SELECT 
        r.*, 
        u.prenom, u.nom, u.email, u.telephone,
        e.title as evenement_titre, e.date as evenement_date, e.lieu as evenement_lieu
      FROM reservations r
      LEFT JOIN utilisateurs u ON r.user_id = u.id
      LEFT JOIN evenements e ON r.evenement_id = e.id
      WHERE r.id = ?
    `;
    
    const reservations = await query(reservationsQuery, [reservationId]);

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    const reservation = reservations[0];

    if (req.user.role === 'Client' && reservation.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    reservation.client = {
      nom: `${reservation.prenom} ${reservation.nom}`,
      email: reservation.email,
      telephone: reservation.telephone
    };
    reservation.evenement = {
      id: reservation.evenement_id,
      titre: reservation.evenement_titre,
      date: reservation.evenement_date,
      lieu: reservation.evenement_lieu
    };
    
    delete reservation.prenom;
    delete reservation.nom;
    delete reservation.email;
    delete reservation.telephone;
    delete reservation.evenement_titre;
    delete reservation.evenement_date;
    delete reservation.evenement_lieu;

    res.json({ reservation });

  } catch (error) {
    console.error('Erreur récupération réservation:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la réservation' });
  }
});

const createValidation = [
  body('evenement_id').isInt().withMessage('ID de l\'événement requis'),
  body('nombre_places').isInt({ min: 1 }).withMessage('Nombre de places invalide')
];

router.post('/', auth, createValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { evenement_id, nombre_places } = req.body;

    const evenements = await query(
      'SELECT * FROM evenements WHERE id = ? AND actif = true',
      [evenement_id]
    );
    if (evenements.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé ou inactif' });
    }
    const evenement = evenements[0];

    if (evenement.places_restantes < nombre_places) {
      return res.status(400).json({ 
        error: `Pas assez de places disponibles (${evenement.places_restantes} restantes)` 
      });
    }

    if (new Date(evenement.date) < new Date()) {
      return res.status(400).json({ error: 'Impossible de réserver pour un événement passé' });
    }

    const montant_total = evenement.prix_par_personne * nombre_places;

    let numeroReservation;
    let attempts = 0;
    do {
      numeroReservation = generateReservationNumber();
      const existing = await query('SELECT id FROM reservations WHERE numero_reservation = ?', [numeroReservation]);
      if (existing.length === 0) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      return res.status(500).json({ error: 'Impossible de générer un numéro de réservation unique' });
    }

    const result = await query(
      'INSERT INTO reservations (numero_reservation, user_id, evenement_id, nombre_places, montant_total, statut) VALUES (?, ?, ?, ?, ?, ?)',
      [numeroReservation, req.user.id, evenement_id, nombre_places, montant_total, 'En attente']
    );

    await query(
      'UPDATE evenements SET places_restantes = places_restantes - ? WHERE id = ?',
      [nombre_places, evenement_id]
    );

    const newReservation = await query(
      'SELECT * FROM reservations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: newReservation[0]
    });

  } catch (error) {
    console.error('Erreur création réservation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

const updateValidation = [
  body('statut').optional().isIn(['En attente', 'Confirmée', 'Annulée']).withMessage('Statut invalide'),
  body('notes_admin').optional().trim()
];

router.put('/:id', auth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reservationId = parseInt(req.params.id);
    const { statut, notes_admin } = req.body;

    const existingReservation = await query('SELECT * FROM reservations WHERE id = ?', [reservationId]);
    if (existingReservation.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    const reservation = existingReservation[0];

    if (req.user.role === 'Client') {
      if (reservation.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Accès refusé' });
      }
      if (statut && statut !== 'Annulée') {
        return res.status(403).json({ error: 'Vous ne pouvez que annuler vos réservations' });
      }
    }

    // Si on annule une réservation confirmée, remettre les places disponibles
    if (statut === 'Annulée' && reservation.statut === 'Confirmée') {
      await query(
        'UPDATE evenements SET places_restantes = places_restantes + ? WHERE id = ?',
        [reservation.nombre_places, reservation.evenement_id]
      );
    }

    if (statut === 'Confirmée' && reservation.statut === 'En attente') {
      const evenement = await query(
        'SELECT places_restantes FROM evenements WHERE id = ?',
        [reservation.evenement_id]
      );
      
      if (evenement[0].places_restantes < reservation.nombre_places) {
        return res.status(400).json({ 
          error: 'Plus assez de places disponibles pour confirmer cette réservation' 
        });
      }
    }

    const updates = [];
    const values = [];

    if (statut !== undefined) { updates.push('statut = ?'); values.push(statut); }
    if (notes_admin !== undefined && req.user.role === 'Admin') { 
      updates.push('notes_admin = ?'); 
      values.push(notes_admin); 
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = NOW()');
    values.push(reservationId);

    await query(
      `UPDATE reservations SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedReservation = await query('SELECT * FROM reservations WHERE id = ?', [reservationId]);

    res.json({
      message: 'Réservation mise à jour avec succès',
      reservation: updatedReservation[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour réservation:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la réservation' });
  }
});

router.get('/stats/overview', auth, adminAuth, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'En attente' THEN 1 ELSE 0 END) as en_attente,
        SUM(CASE WHEN statut = 'Confirmée' THEN 1 ELSE 0 END) as confirmee,
        SUM(CASE WHEN statut = 'Annulée' THEN 1 ELSE 0 END) as annulee,
        SUM(CASE WHEN statut = 'Confirmée' THEN nombre_places ELSE 0 END) as places_vendues,
        SUM(CASE WHEN statut = 'Confirmée' THEN montant_total ELSE 0 END) as chiffre_affaires,
        ROUND(AVG(CASE WHEN statut = 'Confirmée' THEN montant_total END), 2) as panier_moyen,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as nouvelles_aujourd_hui
      FROM reservations
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Erreur stats réservations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
