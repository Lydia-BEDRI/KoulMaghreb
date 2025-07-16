const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const reservationsService = {
    async getMesReservations(token) {
        const response = await fetch(`${API_BASE_URL}/reservations/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Impossible de charger vos réservations');
        const data = await response.json();
        return data.reservations;
    },

    async createReservation(payload, token) {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erreur lors de la réservation');
        }
        return await response.json();
    }
};