<script setup>
import { BellIcon, FunnelIcon } from '@heroicons/vue/24/outline'
</script>

<template>

  <header class="w-full bg-white shadow-sm px-4 py-3 md:px-8 md:py-5" role="banner">
    <div class="max-w-7xl mx-auto">

      <!-- MOBILE -->
      <div class="flex items-center justify-between md:hidden">
        <!-- Logo cliquable -->
        <a href="/" aria-label="Accueil KoulMaghreb">
          <img src="/logo-mob.png" alt="" class="h-12 w-auto" />
        </a>

        <div class="flex items-center space-x-3">
          <!-- Notifications -->
          <button
            class="relative text-gray-600 hover:text-primary transition"
            aria-label="Notifications"
            type="button"
          >
            <BellIcon class="h-6 w-6" />
            <span
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
            ></span>
          </button>
          <!-- Avatar  -->
          <a href="/profil" aria-label="Mon compte">
            <img
              src="https://i.pravatar.cc/40"
              alt="Photo de profil"
              class="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
            />
          </a>
        </div>
      </div>

      <!-- MOBILE -->
      <form
        class="mt-3 flex space-x-2 md:hidden"
        role="search"
        action="/search"
        method="GET"
        aria-label="Recherche de plats"
      >
        <input
          name="q"
          type="search"
          placeholder="Rechercher…"
          class="flex-1 px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
        />
        <button
          class="flex-shrink-0 flex items-center justify-center space-x-1 bg-accent hover:bg-primary px-4 py-2 rounded-lg text-white font-medium transition"
          type="submit"
          aria-label="Filtrer les résultats"
        >
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
        <form
          class="flex flex-1 items-center justify-center mx-8 space-x-2"
          role="search"
          action="/search"
          method="GET"
          aria-label="Recherche de plats"
        >
          <input
            name="q"
            type="search"
            placeholder="Rechercher…"
            class="w-1/2 px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
          />
          <button
            class="flex-shrink-0 flex items-center justify-center space-x-1 bg-accent hover:bg-primary px-4 py-2 rounded-lg text-white font-medium transition"
            type="submit"
            aria-label="Filtrer les résultats"
          >
            <FunnelIcon class="h-5 w-5" />
            <span>Filtrer</span>
          </button>
        </form>

        <!-- Notifications + avatar -->
        <div class="flex items-center space-x-4">
          <button
            class="relative text-gray-600 hover:text-primary transition"
            aria-label="Notifications"
            type="button"
          >
            <BellIcon class="h-6 w-6" />
            <span
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
            ></span>
          </button>
          <a href="/profil" class="flex items-center bg-neutral rounded-lg px-3 py-1 space-x-2 border border-primary" aria-label="Mon compte">
            <img
              src="https://i.pravatar.cc/40"
              alt="Photo de profil"
              class="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
            />
            <span class="font-sans font-medium text-accent">Amine Benali</span>
          </a>
        </div>
      </div>
    </div>
  </header>

</template>

<style scoped>
</style>
