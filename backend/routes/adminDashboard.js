const express = require('express')
const router = express.Router()
const { query } = require('../database/connection')

// Statistiques globales
router.get('/stats', async (req, res) => {
  try {
    const [cmd] = await query('SELECT COUNT(*) as total FROM commandes')
    const [resv] = await query('SELECT COUNT(*) as total FROM reservations')
    const [users] = await query('SELECT COUNT(*) as total FROM utilisateurs')
    const [note] = await query('SELECT AVG(note) as moyenne FROM avis')
    res.json({
      commandes: cmd.total,
      reservations: resv.total,
      utilisateurs: users.total,
      noteMoyenne: parseFloat(note.moyenne || 0).toFixed(2)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Commandes récentes
router.get('/commandes-recentes', async (req, res) => {
  const rows = await query(
    `SELECT c.id, u.nom as client, 
      (SELECT COUNT(*) FROM items_commande ic2 WHERE ic2.commande_id = c.id) as nb_plats, 
      c.statut
     FROM commandes c
     JOIN utilisateurs u ON c.user_id = u.id
     ORDER BY c.created_at DESC LIMIT 5`
  )
  res.json(rows)
})

// Réservations à venir
router.get('/reservations-avenir', async (req, res) => {
  const rows = await query(
    `SELECT e.date as evenement_date, CONCAT(u.nom, ' ', u.prenom) as client, r.nombre_places as personnes
     FROM reservations r
     JOIN utilisateurs u ON r.user_id = u.id
     JOIN evenements e ON r.evenement_id = e.id
     WHERE e.date >= CURDATE()
     ORDER BY e.date ASC LIMIT 5`
  )
  res.json(rows)
})

// Plats populaires
router.get('/plats-populaires', async (req, res) => {
  const rows = await query(
    `SELECT p.nom, COUNT(ic.id) as commandes
     FROM plats p
     JOIN items_commande ic ON ic.plat_id = p.id
     GROUP BY p.id
     ORDER BY commandes DESC
     LIMIT 5`
  )
  res.json(rows)
})

// Plats les plus ajoutés en favoris
router.get('/plats-favoris', async (req, res) => {
  const rows = await query(
    `SELECT p.nom, COUNT(f.id) as favoris
     FROM plats p
     LEFT JOIN favoris f ON f.plat_id = p.id
     GROUP BY p.id
     ORDER BY favoris DESC
     LIMIT 5`
  )
  res.json(rows)
})

// Plats les plus commentés (avis)
router.get('/plats-commentes', async (req, res) => {
  const rows = await query(
    `SELECT p.nom, COUNT(a.id) as nb_avis
     FROM plats p
     LEFT JOIN avis a ON a.plat_id = p.id
     GROUP BY p.id
     ORDER BY nb_avis DESC
     LIMIT 5`
  )
  res.json(rows)
})

module.exports = router
