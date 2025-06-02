<template>
  <div class="p-6 bg-background min-h-screen">
    <h1 class="text-2xl font-semibold mb-6 text-primary">Catalogue des Plats</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="plat in plats"
        :key="plat.id"
        class="bg-white rounded-2xl shadow border border-gray-200 p-6 transition hover:shadow-lg"
      >
        <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img :src="plat.image" :alt="plat.nom" class="w-full h-full object-cover" />
        </div>
        <h2 class="text-lg font-semibold text-primary mb-2">{{ plat.nom }}</h2>
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm text-gray-600">{{ plat.prix }} €</p>
          <div class="flex items-center gap-1">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
              />
            </svg>
            <span class="text-sm text-gray-600 font-medium">{{ plat.note }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center gap-2">
          <button
            class="bg-accent text-white px-4 py-2 rounded-xl hover:bg-primary transition flex-1"
            @click="voirDetails(plat)"
          >
            Détails
          </button>
          <button
            class="bg-primary text-white px-4 py-2 rounded-xl hover:bg-accent transition flex-1"
            @click="ajouterAuPanier(plat)"
          >
            Commander
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-8 gap-2">
      <button
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
        aria-label="Précédent"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="[
          'px-4 py-2 rounded-xl border transition',
          page === currentPage
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white'
        ]"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <button
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
        aria-label="Suivant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { plats as platsData } from '@/data/plats.js'

const plats = ref(platsData)

const totalPages = 3
const currentPage = ref(1) // Page active

const voirDetails = (plat) => {
  alert(`Détails du plat : ${plat.nom}`)
}

const ajouterAuPanier = (plat) => {
  alert(`Le plat "${plat.nom}" a été ajouté au panier.`)
}
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
