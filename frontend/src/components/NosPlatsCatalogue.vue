<template>
  <div class="p-6 bg-background min-h-screen">
    <h1 class="text-2xl font-semibold mb-6 text-primary">Catalogue des Plats</h1>

    <!-- Filtres -->
    <div class="filters space-y-8 mb-8">
      <!-- Type de plat -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Type de plat</h3>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="type in types" :key="type" :class="[
            'bg-white rounded-lg p-4 shadow transition flex items-center justify-center cursor-pointer',
            selectedType === type ? 'border-2 border-primary' : 'border border-gray-200'
          ]" @click="selectedType = (selectedType === type ? '' : type)">
            {{ type }}
          </div>
        </div>
      </div>

      <!-- Pays d'origine -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Pays</h3>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="pays in paysList" :key="pays" :class="[
            'bg-white rounded-lg p-4 shadow transition flex items-center justify-center cursor-pointer',
            selectedPays === pays ? 'border-2 border-accent' : 'border border-gray-200'
          ]" @click="selectedPays = (selectedPays === pays ? '' : pays)">
            {{ pays }}
          </div>
        </div>
      </div>

      <!-- Note et tri -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Note minimale</label>
          <select v-model="selectedNote"
            class="w-full bg-white text-gray-700 rounded-lg p-2 shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="0">Toutes les notes</option>
            <option v-for="note in notes" :key="note" :value="note">
              {{ note }} ⭐
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ordonner par</label>
          <select v-model="selectedOrder"
            class="w-full bg-white text-gray-700 rounded-lg p-2 shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="default">Par défaut</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="note-desc">Note décroissante</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste filtrée -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="plat in filteredPlats" :key="plat.id"
        class="bg-white rounded-2xl shadow border border-gray-200 p-6 transition hover:shadow-lg">
        <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img :src="plat.image" :alt="plat.nom" class="w-full h-full object-cover" />
        </div>
        <h2 class="text-lg font-semibold text-primary mb-2">{{ plat.nom }}</h2>
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm text-gray-600">{{ plat.prix }} €</p>
          <div class="flex items-center gap-1">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
            <span class="text-sm text-gray-600 font-medium">{{ plat.note }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center gap-2">
          <button class="bg-accent text-white px-4 py-2 rounded-xl hover:bg-primary transition flex-1"
            @click="voirDetails(plat)">
            Détails
          </button>
          <button class="bg-primary text-white px-4 py-2 rounded-xl hover:bg-accent transition flex-1"
            @click="ajouterAuPanier(plat)">
            Commander
          </button>
        </div>
      </div>
    </div>

    <!-- Panier flottant -->
    <div
      class="fixed bottom-4 right-4 bg-primary text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center cursor-pointer transition transform hover:scale-110 hover:shadow-2xl"
      @click="redirectToPanier">
      <div class="relative">
        <ShoppingCartIcon class="w-8 h-8 text-white" />
        <span
          class="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {{ panier.length }}
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { plats as platsData } from '@/data/plats.js'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const types = ['Entrée', 'Plat principal', 'Dessert', 'Accompagnement']
const paysList = ['Maroc', 'Algérie', 'Tunisie']
const notes = [5, 4, 3, 2, 1]

const selectedType = ref('')
const selectedPays = ref('')
const selectedNote = ref(0)
const selectedOrder = ref('default')

const plats = ref(platsData)
const panier = ref([])

const filteredPlats = computed(() => {
  let result = plats.value.filter(plat => {
    const matchType = selectedType.value ? plat.type === selectedType.value : true
    const matchPays = selectedPays.value ? plat.pays === selectedPays.value : true
    const matchNote = selectedNote.value ? plat.note >= selectedNote.value : true
    return matchType && matchPays && matchNote
  })

  if (selectedOrder.value === 'prix-asc') {
    result = result.sort((a, b) => a.prix - b.prix)
  } else if (selectedOrder.value === 'prix-desc') {
    result = result.sort((a, b) => b.prix - a.prix)
  } else if (selectedOrder.value === 'note-desc') {
    result = result.sort((a, b) => b.note - a.note)
  }

  return result
})

const ajouterAuPanier = (plat) => {
  const item = panier.value.find(p => p.id === plat.id)
  if (item) {
    item.quantite++
  } else {
    panier.value.push({ ...plat, quantite: 1 })
  }
}

const redirectToPanier = () => {
  router.push('/mon-panier')
}
</script>

<style scoped>
.filters div {
  height: 80px;
}

.fixed {
  z-index: 50;
}
</style>
