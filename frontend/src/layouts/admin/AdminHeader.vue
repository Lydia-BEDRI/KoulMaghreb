<template>
  <header class="bg-white shadow-md px-2 sm:px-4 py-3 flex items-center justify-between">
    <!-- Logo et hamburger -->
    <div class="flex items-center space-x-3">
      <button
        class="sm:hidden mr-2"
        @click="$emit('toggle-sidebar')"
        aria-label="Ouvrir le menu"
      >
        <svg
          class="w-7 h-7 text-primary"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <a href="/" class="flex-shrink-0" aria-label="Accueil KoulMaghreb">
        <img src="/logo-complete.png" alt="" class="h-16 w-auto" />
      </a>
      <span class="text-xl font-bold text-accent hidden sm:inline"
      >Administrateur</span>
    </div>

    <div class="flex items-center space-x-6">
      <RouterLink
        to="/admin/profil"
        class="flex items-center space-x-3 group focus:outline-none"
        title="Voir le profil administrateur"
      >
        <div
          class="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full font-bold uppercase text-white text-base bg-primary group-hover:ring-2 group-hover:ring-primary transition"
          title="Amine Djerad"
        >
          AD
        </div>
        <span
          class="font-semibold text-accent whitespace-nowrap select-none hidden sm:inline group-hover:underline"
        >
          Amine Djerad
        </span>
      </RouterLink>
      <button
        @click="logout"
        title="Se déconnecter"
        class="flex items-center text-accent hover:text-primary transition-colors duration-300"
        aria-label="Se déconnecter"
      >
        <ArrowRightOnRectangleIcon class="w-7 h-7" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { RouterLink } from 'vue-router'

const ArrowRightOnRectangleIcon = defineAsyncComponent(() =>
  import('@heroicons/vue/24/outline/ArrowRightOnRectangleIcon')
)

function logout() {
  alert('Déconnexion simulée.')
}
</script>

<style scoped>
button[title='Se déconnecter'] {
  cursor: pointer;
}
</style>
