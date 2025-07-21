const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const adminDashboardService = {
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`)
    if (!res.ok) throw new Error('Erreur stats')
    return await res.json()
  },
  async getCommandesRecentes() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/commandes-recentes`)
    if (!res.ok) throw new Error('Erreur commandes')
    return await res.json()
  },
  async getReservationsAvenir() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/reservations-avenir`)
    if (!res.ok) throw new Error('Erreur reservations')
    return await res.json()
  },
  async getPlatsPopulaires() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/plats-populaires`)
    if (!res.ok) throw new Error('Erreur plats')
    return await res.json()
  },
  async getPlatsFavoris() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/plats-favoris`)
    if (!res.ok) throw new Error('Erreur favoris')
    return await res.json()
  },
  async getPlatsCommentes() {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/plats-commentes`)
    if (!res.ok) throw new Error('Erreur avis')
    return await res.json()
  }
}