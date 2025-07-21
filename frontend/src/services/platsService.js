const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const platsService = {
  async getAll(page = 1, limit = 50, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      })

      const response = await fetch(`${API_BASE_URL}/plats?${queryParams}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      return data.plats || data || []
      
    } catch (error) {
      console.error('Erreur platsService.getAll:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/plats/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      return data.plat || data
      
    } catch (error) {
      console.error('Erreur platsService.getById:', error)
      throw error
    }
  },

  async search(searchTerm, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        ...filters
      })

      const response = await fetch(`${API_BASE_URL}/plats?${queryParams}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return data.plats || data || []
      
    } catch (error) {
      console.error('Erreur platsService.search:', error)
      throw error
    }
  }
}