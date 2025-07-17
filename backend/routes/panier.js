const express = require('express');
const { query } = require('../database/connection');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur manquant' });
    }

    const panierQuery = `
      SELECT 
        p.id,
        p.type,
        p.quantite,
        p.prix_unitaire,
        p.sous_total,
        p.created_at,
        p.updated_at,
        CASE 
          WHEN p.type = 'plat' THEN JSON_OBJECT(
            'id', pl.id,
            'nom', pl.nom,
            'prix', pl.prix,
            'image', pl.image,
            'short_desc', pl.short_desc,
            'disponible', pl.disponible
          )
          WHEN p.type = 'reservation' THEN JSON_OBJECT(
            'id', e.id,
            'title', e.title,
            'date', e.date,
            'lieu', e.lieu,
            'image', e.image,
            'prix_par_personne', e.prix_par_personne,
            'places_restantes', e.places_restantes,
            'actif', e.actif
          )
        END as item_details
      FROM panier p
      LEFT JOIN plats pl ON p.plat_id = pl.id AND p.type = 'plat'
      LEFT JOIN evenements e ON p.evenement_id = e.id AND p.type = 'reservation'
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `;

    const panierItems = await query(panierQuery, [userId]);
    
    const total = panierItems.reduce((sum, item) => sum + parseFloat(item.sous_total), 0);
    
    res.json({
      panier: panierItems,
      total: total.toFixed(2),
      count: panierItems.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { type, plat_id, evenement_id, quantite = 1 } = req.body;

    console.log('🔍 Données reçues:', { userId, type, plat_id, evenement_id, quantite }); // Debug

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur manquant' });
    }

    if (!type || !['plat', 'reservation'].includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }

    if (type === 'plat' && !plat_id) {
      return res.status(400).json({ error: 'ID du plat manquant' });
    }

    if (type === 'reservation' && !evenement_id) {
      return res.status(400).json({ error: 'ID de l\'événement manquant' });
    }

    let prix_unitaire = 0;
    let itemDetails = {};

    if (type === 'plat') {
      const plats = await query('SELECT * FROM plats WHERE id = ? AND disponible = true', [plat_id]);
      if (plats.length === 0) {
        return res.status(404).json({ error: 'Plat non trouvé ou indisponible' });
      }
      prix_unitaire = plats[0].prix;
      itemDetails = plats[0];
    } else if (type === 'reservation') {
      const evenements = await query('SELECT * FROM evenements WHERE id = ? AND actif = true', [evenement_id]);
      if (evenements.length === 0) {
        return res.status(404).json({ error: 'Événement non trouvé ou inactif' });
      }
      if (evenements[0].places_restantes < quantite) {
        return res.status(400).json({ error: 'Pas assez de places disponibles' });
      }
      prix_unitaire = evenements[0].prix_par_personne;
      itemDetails = evenements[0];
    }

    const sous_total = prix_unitaire * quantite;

    const platIdValue = type === 'plat' ? plat_id : null;
    const evenementIdValue = type === 'reservation' ? evenement_id : null;


    let existingQuery, existingParams;
    
    if (type === 'plat') {
      existingQuery = 'SELECT * FROM panier WHERE user_id = ? AND plat_id = ? AND type = ?';
      existingParams = [userId, plat_id, type];
    } else {
      existingQuery = 'SELECT * FROM panier WHERE user_id = ? AND evenement_id = ? AND type = ?';
      existingParams = [userId, evenement_id, type];
    }
    
    const existingItems = await query(existingQuery, existingParams);

    if (existingItems.length > 0) {
      const newQuantite = existingItems[0].quantite + quantite;
      const newSousTotal = prix_unitaire * newQuantite;
      
      await query(
        'UPDATE panier SET quantite = ?, sous_total = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantite, newSousTotal, existingItems[0].id]
      );
      
      return res.json({ 
        message: 'Quantité mise à jour dans le panier',
        item_id: existingItems[0].id,
        nouvelle_quantite: newQuantite
      });
    } else {
      const insertQuery = `
        INSERT INTO panier (user_id, type, plat_id, evenement_id, quantite, prix_unitaire, sous_total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const insertParams = [
        userId, 
        type, 
        platIdValue,      
        evenementIdValue, 
        quantite, 
        prix_unitaire, 
        sous_total
      ];

      
      const result = await query(insertQuery, insertParams);
      
      return res.status(201).json({
        message: 'Item ajouté au panier',
        item_id: result.insertId,
        details: itemDetails
      });
    }

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur: ' + error.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const itemId = req.params.id;
    const { quantite } = req.body;

    if (!quantite || quantite < 1) {
      return res.status(400).json({ error: 'Quantité invalide' });
    }

    const items = await query('SELECT * FROM panier WHERE id = ? AND user_id = ?', [itemId, userId]);
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item non trouvé dans votre panier' });
    }

    const item = items[0];
    const nouveauSousTotal = item.prix_unitaire * quantite;

    if (item.type === 'reservation') {
      const evenements = await query('SELECT places_restantes FROM evenements WHERE id = ?', [item.evenement_id]);
      if (evenements.length === 0 || evenements[0].places_restantes < quantite) {
        return res.status(400).json({ error: 'Pas assez de places disponibles' });
      }
    }

    await query(
      'UPDATE panier SET quantite = ?, sous_total = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantite, nouveauSousTotal, itemId]
    );

    res.json({ message: 'Quantité mise à jour', nouvelle_quantite: quantite });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const itemId = req.params.id;

    const result = await query('DELETE FROM panier WHERE id = ? AND user_id = ?', [itemId, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item non trouvé dans votre panier' });
    }

    res.json({ message: 'Item supprimé du panier' });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    await query('DELETE FROM panier WHERE user_id = ?', [userId]);

    res.json({ message: 'Panier vidé' });

  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;