<template>
  <div class="h-full p-6 flex flex-col">
    <div class="flex-1">
      <div class="mb-8">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Navigation</h3>
        <nav class="space-y-1">
          <SidebarItem icon="home" label="Accueil" to="/" />

          <SidebarItem v-if="isAuthenticated" icon="list-bullet" label="Nos plats" to="/nos-plats" />
          <SidebarItem v-else icon="fire" label="Découvrir les plats" to="/decouvrir-les-plats" />
          
          <SidebarItem icon="calendar-days" label="Événements" to="/evenements" />
          <SidebarItem icon="newspaper" label="Blog / Actus" to="/blog" />
        </nav>
      </div>

      <div v-if="isAuthenticated" class="mb-8">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Mon espace</h3>
        <nav class="space-y-1">
          <SidebarItem v-if="isAdmin" icon="shield-check" label="Espace Administrateur" to="/admin/dashboard" />
          <SidebarItem icon="user-circle" label="Mon Profil" to="/profil" />
          <SidebarItem icon="heart" label="Mes favoris" to="/mes-favoris" />
          <SidebarItem icon="shopping-cart" label="Mon panier" to="/mon-panier" />
          <SidebarItem icon="archive-box" label="Mes commandes" to="/mes-commandes" />
          <SidebarItem icon="ticket" label="Mes réservations" to="/mes-reservations" />
        </nav>
      </div>

      <div class="mb-8">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Cuisines</h3>
        <nav class="space-y-1">
          <SidebarItem icon="globe-alt" label="Cuisine marocaine" to="/cuisine-marocaine" />
          <SidebarItem icon="globe-alt" label="Cuisine algérienne" to="/cuisine-algerienne" />
          <SidebarItem icon="globe-alt" label="Cuisine tunisienne" to="/cuisine-tunisienne" />
        </nav>
      </div>

      <div class="pt-6 border-t border-gray-200">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Aide & Support</h3>
        <nav class="space-y-1">
          <SidebarItem icon="question-mark-circle" label="FAQ" to="/faq" />
          <SidebarItem icon="chat-bubble-left-ellipsis" label="Nous contacter" to="/contact" />
          <SidebarItem icon="document-text" label="Mentions légales" to="/mentions-legales" />
        </nav>
      </div>
    </div>

    <div v-if="isAuthenticated" class="mt-auto pt-6 border-t border-gray-200">
      <button 
        @click="handleLogout" 
        class="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium"
        :disabled="logoutLoading"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        {{ logoutLoading ? 'Déconnexion...' : 'Se déconnecter' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SidebarItem from './SidebarItem.vue'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated, isAdmin, user, logout } = useAuth()
const router = useRouter()
const toast = useToast()
const logoutLoading = ref(false)

const handleLogout = async () => {
  try {
    logoutLoading.value = true
    await logout()
    toast.success('Déconnexion réussie !')
    router.push('/') 
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    toast.error('Erreur lors de la déconnexion')
  } finally {
    logoutLoading.value = false
  }
}
</script>

<style scoped></style>