import { ref, computed } from 'vue'
import { authService } from '../services/authService'

const user = ref(authService.getCurrentUser())
const isAuthenticated = computed(() => !!user.value)
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

  const logout = async () => {
    await authService.logout()
    user.value = null
  }

  const updateUser = (userData) => {
    user.value = userData
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateUser
  }
}