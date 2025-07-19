const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const panierService = {
  async getPanier(token) {
    const response = await fetch(`${API_BASE_URL}/panier`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Impossible de charger le panier');
    }
    
    return await response.json();
  },

  async ajouterAuPanier({ type, plat_id, evenement_id, quantite = 1 }, token) {

    if (type === 'plat' && !plat_id) {
      throw new Error('ID du plat manquant pour le type plat');
    }
    if (type === 'reservation' && !evenement_id) {
      throw new Error('ID de l\'événement manquant pour le type reservation');
    }

    const requestBody = {
      type,
      quantite
    };

    if (type === 'plat' && plat_id) {
      requestBody.plat_id = plat_id;
    }
    if (type === 'reservation' && evenement_id) {
      requestBody.evenement_id = evenement_id;
    }

    const response = await fetch(`${API_BASE_URL}/panier`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'ajout au panier');
    }

    return await response.json();
  },

  async modifierQuantite(itemId, quantite, token) {
    const response = await fetch(`${API_BASE_URL}/panier/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantite })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la modification de la quantité');
    }

    return await response.json();
  },

  async supprimerItem(itemId, token) {
    const response = await fetch(`${API_BASE_URL}/panier/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'article');
    }

    return await response.json();
  },

  async viderPanier(token) {
    const response = await fetch(`${API_BASE_URL}/panier`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du vidage du panier');
    }

    return await response.json();
  },


  getPanierLocal() {
    try {
      const panier = localStorage.getItem('panier');
      return panier ? JSON.parse(panier) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture du panier local:', error);
      return [];
    }
  },

  ajouterAuPanierLocal(item) {
    try {
      const panier = this.getPanierLocal();
      
      const existingItemIndex = panier.findIndex(p => 
        p.type === item.type && 
        (p.plat_id === item.plat_id || p.evenement_id === item.evenement_id)
      );

      if (existingItemIndex !== -1) {
        panier[existingItemIndex].quantite += item.quantite;
        panier[existingItemIndex].sous_total = (
          parseFloat(panier[existingItemIndex].prix_unitaire || 0) * 
          panier[existingItemIndex].quantite
        ).toFixed(2);
      } else {
        const newItem = {
          id: `local_${Date.now()}`,
          type: item.type,
          plat_id: item.plat_id || null,
          evenement_id: item.evenement_id || null,
          quantite: item.quantite,
          prix_unitaire: parseFloat(item.prix_unitaire || item.details?.plat?.prix || item.details?.prix || 0),
          sous_total: (parseFloat(item.prix_unitaire || item.details?.plat?.prix || item.details?.prix || 0) * item.quantite).toFixed(2),
          item_details: item.details || {},
          created_at: new Date().toISOString()
        };
        panier.push(newItem);
      }

      localStorage.setItem('panier', JSON.stringify(panier));
      return panier;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier local:', error);
      throw error;
    }
  },

  modifierQuantiteLocal(itemId, nouvelleQuantite) {
    try {
      const panier = this.getPanierLocal();
      const itemIndex = panier.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        if (nouvelleQuantite <= 0) {
          panier.splice(itemIndex, 1);
        } else {
          panier[itemIndex].quantite = nouvelleQuantite;
          panier[itemIndex].sous_total = (
            parseFloat(panier[itemIndex].prix_unitaire || 0) * nouvelleQuantite
          ).toFixed(2);
        }
        localStorage.setItem('panier', JSON.stringify(panier));
      }
      return panier;
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      throw error;
    }
  },

  supprimerItemLocal(itemId) {
    try {
      const panier = this.getPanierLocal();
      const nouveauPanier = panier.filter(item => item.id !== itemId);
      localStorage.setItem('panier', JSON.stringify(nouveauPanier));
      return nouveauPanier;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },

  viderPanierLocal() {
    try {
      localStorage.removeItem('panier');
      return [];
    } catch (error) {
      console.error('Erreur lors du vidage du panier local:', error);
      throw error;
    }
  },

  getTotalPanierLocal() {
    try {
      const panier = this.getPanierLocal();
      return panier.reduce((total, item) => {
        const prix = parseFloat(item.prix_unitaire || 0);
        const quantite = parseInt(item.quantite || 0);
        return total + (prix * quantite);
      }, 0);
    } catch (error) {
      console.error('Erreur lors du calcul du total:', error);
      return 0;
    }
  },

  reparerPanierLocal() {
    try {
      const panier = this.getPanierLocal();
      const panierRepare = panier.map(item => {
        let prix = parseFloat(item.prix_unitaire || 0);
        
        if (prix === 0 && item.item_details) {
          if (item.item_details.plat?.prix) {
            prix = parseFloat(item.item_details.plat.prix);
          } else if (item.item_details.prix) {
            prix = parseFloat(item.item_details.prix);
          }
        }

        return {
          ...item,
          prix_unitaire: prix,
          sous_total: (prix * (item.quantite || 1)).toFixed(2)
        };
      });

      localStorage.setItem('panier', JSON.stringify(panierRepare));
      return panierRepare;
    } catch (error) {
      console.error('Erreur lors de la réparation:', error);
      return this.getPanierLocal();
    }
  }
};