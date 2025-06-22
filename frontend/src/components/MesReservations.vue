<template>
  <div class="p-6 bg-background min-h-screen">
    <h1 class="text-2xl font-semibold mb-6 text-primary">Mes réservations</h1>

    <div v-if="reservations.length" class="space-y-6">
      <div
        v-for="(reservation, index) in reservations"
        :key="reservation.id"
        class="bg-white rounded-2xl shadow border border-gray-200 p-4 flex flex-col sm:flex-row items-center gap-4 transition hover:shadow-lg hover:-translate-y-1"
      >
        <div class="w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
          <img :src="reservation.image" :alt="reservation.titre" class="w-full h-full object-cover" />
        </div>

        <div class="flex-1">
          <p class="text-lg font-semibold text-primary">{{ reservation.titre }}</p>
          <p class="text-sm text-gray-600 space-y-1">
            <span class="flex items-center gap-1">
              <Icon icon="mdi:calendar" class="text-primary text-base" /> {{ formatDate(reservation.date) }} à {{ formatHour(reservation.date) }}
            </span>
            <span class="flex items-center gap-1">
              <Icon icon="mdi:map-marker" class="text-primary text-base" /> {{ reservation.lieu }}
            </span>
            <span class="flex items-center gap-1">
              <Icon icon="mdi:account-group" class="text-primary text-base" /> {{ reservation.nbPlaces }} place(s) réservée(s)
            </span>
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3">
          <span
            :class="[
              'text-sm font-semibold px-3 py-1 rounded-full',
              reservation.statut === 'confirmée' ? 'bg-green-100 text-green-700' :
              reservation.statut === 'en attente' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            ]"
          >
            {{ reservation.statut }}
          </span>
          <RouterLink
            :to="{ name: 'Événement Détail', params: { id: reservation.id } }"
            class=" bg-accent text-white px-4 py-2 rounded-xl hover:bg-primary transition flex items-center gap-2"
          >
            <Icon icon="mdi:eye" class="text-white text-base" /> Voir
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 mt-10">
      <p>Vous n'avez pas encore de réservations.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import fr from 'date-fns/locale/fr'
import { Icon } from '@iconify/vue'

const reservations = ref([
  {
    id: 1,
    titre: 'Soirée Couscous & Musique Andalouse',
    image: '/img/events/couscous-iftar.jpeg',
    date: '2025-07-10T20:00:00',
    lieu: 'Paris',
    nbPlaces: 2,
    statut: 'confirmée',
  },
  {
    id: 2,
    titre: 'Buffet spécial Ramadan',
    image: '/img/events/ramadan-event.jpeg',
    date: '2025-07-15T18:00:00',
    lieu: 'Paris',
    nbPlaces: 3,
    statut: 'en attente',
  },
])

const formatDate = (date) => format(new Date(date), 'dd MMMM yyyy', { locale: fr })
const formatHour = (date) => format(new Date(date), 'HH:mm')
</script>