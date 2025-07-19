const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const evenementsService = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/evenements`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        return data.evenements;
    },
    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/evenements/${id}`);
        if (!response.ok) throw new Error('Event not found');
        const data = await response.json();
        return data.evenement;
    },
    async getAllEvenements(token, page = 1, limit = 20, filters = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        })
        const response = await fetch(`${API_BASE_URL}/evenements?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
            throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
        }
        const data = await response.json()
        return {
            ...data,
            evenements: data.evenements.map(ev => ({
                ...ev,
                placesTotal: ev.places_total,
                placesRestantes: ev.places_restantes,
                shortDesc: ev.short_desc ?? '',
                longDesc: ev.long_desc ?? ''
            }))
        }
    }
};