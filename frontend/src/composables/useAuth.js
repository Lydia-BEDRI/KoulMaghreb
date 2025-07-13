import { ref, computed } from 'vue'
import { authService } from '../services/authService'

const user = ref(authService.getCurrentUser())
const isAuthenticated = computed(() => !!user.value && !!localStorage.getItem('auth_token'))
const isAdmin = computed(() => user.value?.role === 'Admin')

export const useAuth = () => {
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      user.value = data.user
      return data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const data = await authService.register(userData)
      user.value = data.user
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const refreshUserData = async () => {
    try {
      if (!isAuthenticated.value) {
        throw new Error('Utilisateur non connecté')
      }
      
      const userData = await authService.getCurrentUserProfile()
      
      if (!userData) {
        throw new Error('Aucune donnée utilisateur reçue')
      }
      
      user.value = userData
      localStorage.setItem('user_data', JSON.stringify(userData))
      return userData
      
    } catch (error) {
      console.error('Erreur refresh user data:', error)
      if (error.message.includes('401') || error.message.includes('Token') || error.message.includes('non connecté')) {
        logout()
      }
      throw error
    }
  }

  const updateUserProfile = async (userData) => {
    try {
      if (!isAuthenticated.value) {
        throw new Error('Utilisateur non connecté')
      }
      
      const updatedUser = await authService.updateUserProfile(userData)
      user.value = updatedUser
      return updatedUser
    } catch (error) {
      console.error('Erreur update user profile:', error)
      throw error
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    refreshUserData,
    updateUserProfile
  }
}