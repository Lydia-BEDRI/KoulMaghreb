export const avisService = {
    async getByPlatId(platId, limit = 10, page = 1) {
        const res = await fetch(`http://localhost:3001/api/avis?plat_id=${platId}&limit=${limit}&page=${page}`)
        if (!res.ok) throw new Error('Error loading comments')
        return await res.json()
    },
    async postAvis({ plat_id, note, commentaire }, token) {
        const res = await fetch('http://localhost:3001/api/avis', {
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
    }
}