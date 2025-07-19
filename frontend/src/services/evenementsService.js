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
    }
};