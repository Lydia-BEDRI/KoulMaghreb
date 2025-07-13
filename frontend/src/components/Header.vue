<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { BellIcon, FunnelIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '../composables/useAuth'
import { useModalStore } from '../stores/useModalStore'

const { isAuthenticated, isAdmin, user, logout } = useAuth()
const modal = useModalStore()
const router = useRouter()
const toast = useToast()

if (isAuthenticated.value && isAdmin.value && router.currentRoute.value.path === '/') {
  router.push('/admin/dashboard')
}

const openMenu = ref(false) 
const openMobileMenu = ref(false)
const logoutLoading = ref(false)

function toggleMenu() {
  openMenu.value = !openMenu.value
}

function toggleMobileMenu() {
  openMobileMenu.value = !openMobileMenu.value
}

function handleLoginClick() {
  modal.openLogin() 
  openMenu.value = false 
  openMobileMenu.value = false
}

function handleSignupClick() {
  modal.openSignup() 
  openMenu.value = false
  openMobileMenu.value = false
}

const handleLogout = async () => {
  try {
    logoutLoading.value = true
    await logout()
    toast.success('Déconnexion réussie !')
    router.push('/')
    openMenu.value = false
    openMobileMenu.value = false
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    toast.error('Erreur lors de la déconnexion')
  } finally {
    logoutLoading.value = false
  }
}

watch(() => modal.showLoginModal, (isModalVisible) => {
  if (isModalVisible) {
    openMenu.value = false
    openMobileMenu.value = false
  }
})
</script>

<template>
  <header class="w-full bg-white shadow-sm sticky top-0 z-40" role="banner">
    <div class="w-full px-4 py-3">
      <div class="flex items-center justify-between lg:hidden">
        <button 
          @click="toggleMobileMenu"
          class="p-2 text-accent hover:text-primary transition"
          aria-label="Menu principal"
        >
          <Bars3Icon v-if="!openMobileMenu" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>

        <a href="/" class="flex-shrink-0" aria-label="Accueil KoulMaghreb">
          <img src="/logo-mob.png" alt="KoulMaghreb" class="h-10 w-auto" />
        </a>

        <div class="flex items-center space-x-2">
          <button 
            class="relative p-2 text-accent hover:text-primary transition" 
            aria-label="Notifications"
          >
            <BellIcon class="h-5 w-5" />
            <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white"></span>
          </button>

          <div class="relative">
            <div v-if="isAuthenticated" class="flex items-center space-x-2">
              <button 
                @click="toggleMenu"
                class="flex items-center space-x-1 p-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                aria-label="Compte utilisateur"
              >
                <div class="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center">
                  <span class="font-semibold text-xs">
                    {{ user?.prenom?.[0]?.toUpperCase() }}{{ user?.nom?.[0]?.toUpperCase() }}
                  </span>
                </div>
                <svg class="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div v-if="openMenu"
                class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-800">{{ user?.prenom }} {{ user?.nom }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                </div>
                <button 
                  @click="handleLogout"
                  class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  :disabled="logoutLoading"
                >
                  {{ logoutLoading ? 'Déconnexion...' : 'Se déconnecter' }}
                </button>
              </div>
            </div>

            <div v-else>
              <button 
                @click="toggleMenu"
                class="flex items-center justify-center w-6 h-6 bg-accent text-white rounded-full hover:bg-primary transition"
                aria-label="Compte utilisateur"
              >
                <UserIcon class="h-3 w-3" />
              </button>

              <div v-if="openMenu"
                class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button @click="handleLoginClick"
                  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                  Se connecter
                </button>
                <button @click="handleSignupClick"
                  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden lg:flex items-center justify-between">
        <a href="/" class="flex-shrink-0" aria-label="Accueil KoulMaghreb">
          <img src="/logo.png" alt="KoulMaghreb" class="h-12 lg:h-10 xl:h-12 w-auto" />
        </a>

        <div class="flex-1 max-w-xl lg:max-w-lg xl:max-w-2xl mx-4 lg:mx-6 xl:mx-8">
          <form class="flex items-center space-x-2 lg:space-x-3" role="search" action="/search" method="GET">
            <div class="flex-1 relative">
              <input 
                name="q" 
                type="search" 
                placeholder="Rechercher un plat, une spécialité..."
                class="w-full px-3 lg:px-4 py-2 lg:py-2.5 pr-10 lg:pr-12 border border-gray-300 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-gray-400 text-sm"
              />
              <button 
                type="submit"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-accent transition"
                aria-label="Rechercher"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button
              class="flex items-center justify-center px-3 lg:px-4 py-2 lg:py-2.5 bg-accent hover:bg-primary text-white rounded-lg lg:rounded-xl transition font-medium text-sm"
              type="button"
              aria-label="Filtres de recherche"
            >
              <FunnelIcon class="h-4 w-4 lg:mr-2" />
              <span class="hidden lg:inline">Filtres</span>
            </button>
          </form>
        </div>

        <div class="flex items-center space-x-2 lg:space-x-4">
          <button 
            class="relative p-2 text-accent hover:text-primary transition rounded-lg hover:bg-gray-50" 
            aria-label="Notifications"
          >
            <BellIcon class="h-5 lg:h-6 w-5 lg:w-6" />
            <span class="absolute top-1 right-1 block h-2 lg:h-2.5 w-2 lg:w-2.5 rounded-full bg-red-500 ring-1 lg:ring-2 ring-white"></span>
          </button>

          <div class="relative">
            <div v-if="isAuthenticated" class="flex items-center space-x-3">
              <div class="relative">
                <button 
                  @click="toggleMenu"
                  class="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg lg:rounded-xl text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
                >
                  <div class="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center">
                    <span class="font-semibold text-xs">
                      {{ user?.prenom?.[0]?.toUpperCase() }}{{ user?.nom?.[0]?.toUpperCase() }}
                    </span>
                  </div>
                  <div class="hidden lg:block text-left">
                    <p class="text-sm font-medium">{{ user?.prenom }} {{ user?.nom }}</p>
                  </div>
                  <svg class="ml-1 lg:ml-2 h-3 lg:h-4 w-3 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div v-if="openMenu"
                  class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg lg:rounded-xl shadow-lg z-50 py-2">
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-800">{{ user?.prenom }} {{ user?.nom }}</p>
                    <p class="text-xs text-gray-500">{{ user?.email }}</p>
                    <p class="text-xs text-accent">{{ user?.role === 'Admin' ? 'Administrateur' : 'Mon Espace Client' }}</p>
                  </div>
                  <a href="/profil" @click="openMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    Mon profil
                  </a>
                  <a href="/mes-commandes" @click="openMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    Mes commandes
                  </a>
                  <a href="/mes-favoris" @click="openMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    Mes favoris
                  </a>
                  <div v-if="isAdmin" class="border-t border-gray-100 mt-2 pt-2">
                    <a href="/admin/dashboard" @click="openMenu = false" class="block px-4 py-2 text-sm text-accent hover:bg-accent/10 transition">
                      Espace administrateur
                    </a>
                  </div>
                </div>
              </div>

              <button 
                @click="handleLogout"
                class="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                :disabled="logoutLoading"
                title="Se déconnecter"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>

            <div v-else class="relative">
              <button 
                @click="toggleMenu"
                class="flex items-center px-3 lg:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg lg:rounded-xl text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
              >
                <UserIcon class="h-4 lg:h-5 w-4 lg:w-5 lg:mr-2" />
                <span class="hidden lg:inline">Mon compte</span>
                <svg class="ml-1 lg:ml-2 h-3 lg:h-4 w-3 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div v-if="openMenu"
                class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg lg:rounded-xl shadow-lg z-50 py-2">
                <button @click="handleLoginClick"
                  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                  Se connecter
                </button>
                <hr class="my-1 border-gray-100">
                <button @click="handleSignupClick"
                  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 lg:hidden">
        <form class="flex space-x-2" role="search" action="/search" method="GET">
          <input 
            name="q" 
            type="search" 
            placeholder="Rechercher..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400 text-sm"
          />
          <button
            class="flex items-center justify-center px-3 py-2 bg-accent hover:bg-primary text-white rounded-lg transition"
            type="submit"
            aria-label="Rechercher"
          >
            <FunnelIcon class="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>

    <div 
      v-if="openMobileMenu"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      @click="openMobileMenu = false"
    >
      <div 
        class="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <img src="/logo-mob.png" alt="KoulMaghreb" class="h-8 w-auto" />
          <button 
            @click="openMobileMenu = false"
            class="p-2 text-gray-500 hover:text-gray-700 transition"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <div v-if="isAuthenticated" class="p-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center">
              <span class="font-semibold text-xs">
                {{ user?.prenom?.[0]?.toUpperCase() }}{{ user?.nom?.[0]?.toUpperCase() }}
              </span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">{{ user?.prenom }} {{ user?.nom }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
            <button 
              @click="handleLogout"
              class="p-2 text-red-500 hover:text-red-600 transition-colors"
              :disabled="logoutLoading"
              title="Se déconnecter"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>

        <nav class="p-4 space-y-6">
          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Navigation</h3>
            <div class="space-y-1">
              <a href="/" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Accueil
              </a>
              <a href="/nos-plats" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Nos plats
              </a>
              <a v-if="!isAuthenticated" href="/decouvrir-les-plats" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                </svg>
                Découvrir les plats
              </a>
              <a href="/evenements" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Événements
              </a>
              <a href="/contact" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Contact
              </a>
              <a href="/faq" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                FAQ
              </a>
            </div>
          </div>

          <div v-if="isAuthenticated">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Mon espace</h3>
            <div class="space-y-1">
              <a v-if="isAdmin" href="/admin/dashboard" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-accent rounded-lg hover:bg-accent/10 transition">
                <svg class="h-5 w-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Espace Administrateur
              </a>
              <a href="/mes-commandes" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mes commandes
              </a>
              <a href="/mes-reservations" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Mes réservations
              </a>
              <a href="/mes-favoris" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Mes favoris
              </a>
              <a href="/mon-panier" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Mon panier
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cuisines</h3>
            <div class="space-y-1">
              <a href="/cuisine-marocaine" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cuisine marocaine
              </a>
              <a href="/cuisine-algerienne" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cuisine algérienne
              </a>
              <a href="/cuisine-tunisienne" @click="openMobileMenu = false" class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <svg class="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cuisine tunisienne
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.transform {
  transition: transform 0.3s ease-in-out;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
