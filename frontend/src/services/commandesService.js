const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const commandesService = {
  async getMesCommandes(token, page = 1, limit = 10, statut = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (statut) {
      params.append('statut', statut);
    }

    const response = await fetch(`${API_BASE_URL}/commandes?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la récupération des commandes');
    }

    return await response.json();
  },

  async getCommandeById(commandeId, token) {
    const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la récupération de la commande');
    }

    const data = await response.json();
    return data.commande || data;
  },

  async creerCommande(items, token) {
    const response = await fetch(`${API_BASE_URL}/commandes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création de la commande');
    }

    return await response.json();
  },

  async annulerCommande(commandeId, token) {
    const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ statut: 'Annulée' })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l\'annulation de la commande');
    }

    return await response.json();
  }
}