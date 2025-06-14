<template>
  <div class="p-6 min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Image du plat -->
      <div>
        <img
          :src="plat.image"
          :alt="plat.nom"
          class="rounded-lg shadow-lg w-full max-h-96 object-cover"
        />
      </div>

      <div class="space-y-4">
        <h1 class="text-3xl font-semibold text-primary">{{ plat.nom }}</h1>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="flex items-center text-yellow-400">
              <template v-for="n in Math.floor(plat.note)">
            <Icon icon="mdi:star" class="text-xl" />
              </template>
              <template v-if="plat.note % 1 !== 0">
            <Icon icon="mdi:star-half-full" class="text-xl" />
              </template>
            </span>
            <span class="text-lg text-gray-700 font-semibold">{{ plat.note }}</span>
          </div>
        </div>
        <p class="text-2xl font-semibold text-accent">{{ plat.prix }} €</p>

        <p class="text-gray-600">{{ plat.shortDesc }}</p>

        <!-- Boutons d'action -->
        <div class="flex items-center gap-4">
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            @click="decrementQuantity"
          >
            -
          </button>
          <span class="text-lg font-semibold">{{ quantity }}</span>
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            @click="incrementQuantity"
          >
            +
          </button>
          <button
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center gap-2"
            @click="ajouterAuPanier"
          >
            <Icon icon="mdi:cart-plus" class="text-xl" />
            Ajouter au panier
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-lg transition flex items-center justify-center border',
              isFavori
                ? ' border-accent text-accent'
                : 'bg-accent/80 border-accent text-accent'
            ]"
            @click="toggleFavori"
          >
            <Icon
              :icon="isFavori ? 'mdi:heart' : 'mdi:heart-outline'"
              :class="isFavori ? 'text-accent' : 'text-accent'"
              class="text-xl"
            />
          </button>
        </div>

        <!-- pays et type -->
        <div class="space-y-1">
          <p class="text-gray-700"><strong>Pays :</strong> {{ plat.pays }}</p>
          <p class="text-gray-700"><strong>Type :</strong> {{ plat.type }}</p>
        </div>
      </div>
    </div>

    <!-- Description longue -->
    <div class="mt-8 mb-12">
      <h2 class="text-xl font-semibold text-primary mb-4">Description</h2>
      <p class="text-gray-600">{{ plat.longDesc }}</p>
    </div>

    <!-- Plats similaires -->
    <div class="mt-12">
      <h2 class="text-xl font-semibold text-primary mb-4">Plats similaires</h2>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="similarPlat in similarPlats"
          :key="similarPlat.id"
          class="flex items-center bg-white rounded-xl shadow-lg p-4 gap-4 max-w-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
        >
          <img
            :src="similarPlat.image"
            :alt="similarPlat.nom"
            class="rounded-lg w-32 h-32 object-cover"
          />

          <div class="flex-1 space-y-2">
            <h3 class="text-lg font-semibold text-primary">{{ similarPlat.nom }}</h3>
            <div class="flex items-center gap-2">
              <span class="flex items-center text-yellow-400">
                <template v-for="n in Math.floor(similarPlat.note)">
                  <Icon icon="mdi:star" class="text-sm" />
                </template>
                <template v-if="similarPlat.note % 1 !== 0">
                  <Icon icon="mdi:star-half-full" class="text-sm" />
                </template>
              </span>
              <span class="text-sm text-gray-700 font-semibold">{{ similarPlat.note }}</span>
            </div>
            <p class="text-lg font-semibold text-primary">{{ similarPlat.prix }} €</p>
            <button
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center gap-2"
              @click="ajouterAuPanier(similarPlat)"
            >
              <Icon icon="mdi:cart-plus" class="text-sm" />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { plats } from '@/data/plats.js'
import { Icon } from '@iconify/vue'

const route = useRoute()
const platId = route.params.id
const plat = ref(plats.find(p => p.id === parseInt(platId)))

const quantity = ref(1)

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const ajouterAuPanier = (platToAdd = plat.value) => {
  alert(`Ajouté "${platToAdd.nom}" au panier.`)
}

const isFavori = ref(false)
const toggleFavori = () => {
  isFavori.value = !isFavori.value
}

const similarPlats = computed(() => {
  return plats.filter(p => p.id !== plat.value.id && p.type === plat.value.type)
})
</script>

<style scoped>
</style>