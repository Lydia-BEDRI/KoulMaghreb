<script setup>
import { ref, onMounted } from 'vue'
import EvenementCard from './EvenementCard.vue'
import { evenementsService } from '@/services/evenementsService.js'
import { useSeo } from '@/composables/useSeo.js'

const evenements = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    evenements.value = await evenementsService.getAll()
  } catch (e) {
    error.value = 'Failed to load events'
  } finally {
    loading.value = false
  }
})

useSeo({
  title: 'Événements maghrébins à venir - KoulMaghreb',
  description: "Découvrez et participez aux événements culinaires, ateliers et rencontres culturelles organisés par KoulMaghreb."
})
</script>

<template>
  <div class="p-6 bg-background min-h-screen">
    <h1 class="text-2xl font-semibold mb-6 text-primary">Événements</h1>
    <p class="mb-8 text-base text-gray-700">
      Découvrez tous les événements à venir organisés par KoulMaghreb : ateliers, conférences, rencontres culturelles et bien plus encore. Restez informé et participez à la vie de notre communauté maghrébine !
    </p>
    <div v-if="loading" class="text-center py-8">Chargement...</div>
    <div v-else-if="error" class="text-red-600 text-center py-8">{{ error }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <EvenementCard v-for="event in evenements" :key="event.id" :event="event" /> 
    </div>
  </div>
</template>