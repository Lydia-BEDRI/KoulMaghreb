const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const reservationsService = {
  /**
   * Créer une nouvelle réservation
   */
  async creerReservation({ evenement_id, nombre_places }, token) {
    if (!evenement_id) {
      throw new Error('ID événement manquant')
    }
    
    if (!nombre_places || nombre_places <= 0) {
      throw new Error('Nombre de places invalide')
    }

    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        evenement_id: parseInt(evenement_id),
        nombre_places: parseInt(nombre_places)
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la réservation')
    }

    return await response.json()
  },

  /**
   * Récupérer mes réservations
   */
  async getMesReservations(token) {
    const response = await fetch(`${API_BASE_URL}/reservations/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la récupération des réservations')
    }

    return await response.json()
  },

  /**
   * Annuler une réservation
   */
  async annulerReservation(reservationId, token) {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ statut: 'Annulée' })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de l\'annulation')
    }

    return await response.json()
  },

  /**
   * Récupérer une réservation par ID
   */
  async getReservationById(reservationId, token) {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Réservation non trouvée')
    }

    return await response.json()
  },

  async getAllReservations(token, page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      })

      const response = await fetch(`${API_BASE_URL}/reservations?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  async updateReservation(reservationId, updates, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  async getStatsReservations(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }
}