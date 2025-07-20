const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const avisService = {
    async getByPlatId(platId, limit = 10, page = 1) {
        const res = await fetch(`${API_BASE_URL}/avis?plat_id=${platId}&limit=${limit}&page=${page}`)
        if (!res.ok) throw new Error('Error loading comments')
        return await res.json()
    },

    async postAvis({ plat_id, note, commentaire }, token) {
        const res = await fetch(`${API_BASE_URL}/avis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ plat_id, note, commentaire })
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || 'Error posting review')
        }
        return await res.json()
    },

    async getAllAvis(token, page = 1, limit = 10, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...filters
            })

            const response = await fetch(`${API_BASE_URL}/avis?${queryParams}`, {
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

    async updateAvis(avisId, updates, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/avis/${avisId}`, {
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

    async deleteAvis(avisId, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/avis/${avisId}`, {
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
        } catch (error) {
            throw error
        }
    },

    async getStatsAvis(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/avis/stats/overview`, {
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