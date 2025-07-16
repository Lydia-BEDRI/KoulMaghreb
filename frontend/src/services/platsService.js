const API_BASE_URL = 'http://localhost:3001/api'

export const platsService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/plats${query ? `?${query}` : ''}`)
    if (!response.ok) throw new Error('Erreur lors de la récupération des plats')
    const data = await response.json()
    return data.plats
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/plats/${id}`)
    if (!response.ok) throw new Error('Plat non trouvé')
    const data = await response.json()
    return data.plat
  }
}