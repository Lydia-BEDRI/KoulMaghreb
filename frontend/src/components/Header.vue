<script setup>
import { ref, watch } from 'vue'
import { BellIcon, FunnelIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useModalStore } from '../stores/useModalStore'

const openMenu = ref(false) 
const modal = useModalStore()

function toggleMenu() {
  openMenu.value = !openMenu.value
}

function handleLoginClick() {
  modal.openLogin() 
  openMenu.value = false 
}

watch(() => modal.showLoginModal, (isModalVisible) => {
  if (isModalVisible) {
    openMenu.value = false
  }
})
</script>

<template>
  <header class="w-full bg-white shadow-sm px-4 py-3 md:px-4 md:py-3" role="banner">
    <div class="w-full">
      <!-- MOBILE -->
      <div class="flex items-center justify-between md:hidden">
        <!-- Logo cliquable -->
        <a href="/" aria-label="Accueil KoulMaghreb">
          <img src="/logo-mob.png" alt="" class="h-12 w-auto" />
        </a>

        <div class="flex items-center space-x-3">
          <!-- Notifications -->
          <button class="relative text-accent hover:text-primary transition" aria-label="Notifications" type="button">
            <BellIcon class="h-6 w-6" />
            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <!-- Bouton Compte (Mobile) -->
          <div class="relative">
            <button @click="toggleMenu"
              class="flex items-center bg-neutral rounded-lg px-3 py-1 border border-primary text-accent font-medium hover:bg-primary hover:text-white transition">
              Compte
              <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Menu déroulant Mobile -->
            <div v-if="openMenu"
              class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button @click="handleLoginClick"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-neutral">Se connecter</button>
              <a href="/register" class="block px-4 py-2 text-sm text-gray-700 hover:bg-neutral">S’inscrire</a>
            </div>
          </div>
        </div>
      </div>

      <!-- MOBILE -->
      <form class="mt-3 flex space-x-2 md:hidden" role="search" action="/search" method="GET"
        aria-label="Recherche de plats">
        <input name="q" type="search" placeholder="Rechercher…"
          class="flex-1 px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400" />
        <button
          class="flex-shrink-0 flex items-center justify-center space-x-1 bg-accent hover:bg-primary px-4 py-2 rounded-lg text-white font-medium transition"
          type="submit" aria-label="Filtrer les résultats">
          <FunnelIcon class="h-5 w-5" />
          <span class="whitespace-nowrap">Filtrer</span>
        </button>
      </form>

      <!-- DESKTOP -->
      <div class="hidden md:flex items-center justify-between">
        <!-- Logo cliquable -->
        <a href="/" class="flex-shrink-0" aria-label="Accueil KoulMaghreb">
          <img src="/logo.png" alt="" class="h-16 w-auto" />
        </a>

        <!-- Recherche + Filtrer -->

        <form class="flex flex-1 items-center justify-start space-x-2 ml-8" role="search" action="/search" method="GET"
          aria-label="Recherche de plats">
          <input name="q" type="search" placeholder="Rechercher…"
            class="w-1/2 px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400" />
          <button
            class="flex-shrink-0 flex items-center justify-center space-x-1 bg-accent hover:bg-primary px-4 py-2 rounded-lg text-white font-medium transition"
            type="submit" aria-label="Filtrer les résultats">
            <FunnelIcon class="h-5 w-5" />
            <span>Filtrer</span>
          </button>
        </form>

        <!-- Bouton Compte (Desktop) -->
        <div class="relative">
          <button @click="toggleMenu"
            class="flex items-center bg-neutral rounded-lg px-3 py-2 border border-primary text-accent font-medium hover:bg-primary hover:text-white transition">
            <UserIcon class="h-5 w-auto mr-2" /> <!-- Ajout de l'icône UserIcon -->
            Compte
          </button>

          <!-- Menu déroulant Desktop -->
          <div v-if="openMenu"
            class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button @click="handleLoginClick"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-neutral">Se connecter</button>
            <a href="/register" class="block px-4 py-2 text-sm text-gray-700 hover:bg-neutral">S’inscrire</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
