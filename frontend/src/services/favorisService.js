const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const favorisService = {
    async getMesFavoris(token) {
        const response = await fetch(`${API_BASE_URL}/favoris`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Impossible de charger vos favoris');
        const data = await response.json();
        return data.favoris;
    },

    async ajouterFavori(platId, token) {
        console.log('Ajout favori - platId:', platId, 'token:', token ? 'présent' : 'absent'); // Debug
        const response = await fetch(`${API_BASE_URL}/favoris`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plat_id: platId })
        });
        
        console.log('Response status:', response.status); 
        
        if (!response.ok) {
            const err = await response.json();
            console.error('Erreur response:', err); 
            throw new Error(err.error || 'Erreur lors de l\'ajout aux favoris');
        }
        return await response.json();
    },

    async supprimerFavori(platId, token) {
        const response = await fetch(`${API_BASE_URL}/favoris/${platId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erreur lors de la suppression');
        }
        return await response.json();
    }
};