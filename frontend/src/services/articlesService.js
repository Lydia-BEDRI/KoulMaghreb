const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const articlesService = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/articles`)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des articles')
        }
        const data = await response.json()
        return data.articles
    },

    async getBySlug(slug) {
        const response = await fetch(`${API_BASE_URL}/articles/${slug}`)
        if (!response.ok) {
            throw new Error('Article non trouvé')
        }
        return response.json()
    },

    async deleteArticle(id, token) {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'DELETE',
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
    }
}