const API_BASE_URL = 'http://localhost:3001/api'

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur de connexion')
    }
    
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user_data', JSON.stringify(data.user))
    
    return data
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur d\'inscription')
    }
    
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user_data', JSON.stringify(data.user))
    
    return data
  },

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  async getCurrentUserProfile() {
    try {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        throw new Error('Token manquant')
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token invalide ou expiré')
        }
        throw new Error('Erreur lors de la récupération du profil')
      }

      const data = await response.json()
      
      if (!data.user) {
        throw new Error('Aucune donnée utilisateur dans la réponse')
      }
      
      return data.user
    } catch (error) {
      throw error
    }
  },

  async updateUserProfile(userData) {
    try {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        throw new Error('Token manquant')
      }

      const user = this.getCurrentUser()
      if (!user) {
        throw new Error('Utilisateur non connecté')
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour')
      }

      const data = await response.json()
      localStorage.setItem('user_data', JSON.stringify(data.user))
      
      return data.user
    } catch (error) {
      throw error
    }
  },

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data')
      
      if (!userData) {
        return null
      }
      
      return JSON.parse(userData)
    } catch (error) {
      localStorage.removeItem('user_data')
      return null
    }
  }
}