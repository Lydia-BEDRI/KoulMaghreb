const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const adminCommandesService = {
  async getAllCommandes(token, page = 1, limit = 50, statut = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (statut) {
        params.append('statut', statut)
      }

      const response = await fetch(`${API_BASE_URL}/commandes/admin/all?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des commandes')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur adminCommandesService.getAllCommandes:', error)
      throw error
    }
  },

  async getCommandeById(token, commandeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération de la commande')
      }

      const data = await response.json()
      return data.commande || data
    } catch (error) {
      console.error('Erreur adminCommandesService.getCommandeById:', error)
      throw error
    }
  },

  async updateCommande(token, commandeId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur adminCommandesService.updateCommande:', error)
      throw error
    }
  },

  async getStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/commandes/stats/overview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur adminCommandesService.getStats:', error)
      throw error
    }
  }
}