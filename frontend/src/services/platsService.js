const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const platsService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/plats`)
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des plats')
    }
    const data = await response.json()
    return data.plats || data
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/plats/${id}`)
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du plat')
    }
    return await response.json()
  }
}