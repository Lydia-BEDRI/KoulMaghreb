const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const adminUtilisateursService = {
  async getAllUtilisateurs(token, page = 1, limit = 50, search = '', statut = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (search) {
        params.append('search', search)
      }
      
      if (statut) {
        params.append('statut', statut)
      }

      const response = await fetch(`${API_BASE_URL}/users?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des utilisateurs')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur adminUtilisateursService.getAllUtilisateurs:', error)
      throw error
    }
  },

  async getUtilisateurById(token, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération de l\'utilisateur')
      }

      const data = await response.json()
      return data.user || data
    } catch (error) {
      console.error('Erreur adminUtilisateursService.getUtilisateurById:', error)
      throw error
    }
  },

  async updateUtilisateur(token, userId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
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
      console.error('Erreur adminUtilisateursService.updateUtilisateur:', error)
      throw error
    }
  },

  async deleteUtilisateur(token, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur adminUtilisateursService.deleteUtilisateur:', error)
      throw error
    }
  },

  async getStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats/overview`, {
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
      console.error('Erreur adminUtilisateursService.getStats:', error)
      throw error
    }
  }
}