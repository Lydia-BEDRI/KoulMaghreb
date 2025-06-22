<script setup>
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ref, computed } from 'vue'

import { evenements } from '@/data/evenements.js'
import ReservationForm from '@/components/ReservationForm.vue'

const route = useRoute()
const id = parseInt(route.params.id)
const event = ref(evenements.find(e => e.id === id))

const formattedDate = computed(() => {
  return format(new Date(event.value.date), 'dd MMMM yyyy à HH:mm', { locale: fr })
})
</script>

<template>
  <div class="p-6 min-h-screen max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div class="space-y-6">
        <img
          :src="event.image"
          :alt="event.title"
          class="rounded-xl shadow-lg w-full max-h-96 object-cover"
        />

        <div>
          <h2 class="text-xl font-semibold text-primary mb-3">À propos de l'événement</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ event.longDesc }}</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="space-y-3">
          <h1 class="text-3xl font-bold text-primary">{{ event.title }}</h1>

          <div class="flex items-center gap-2 text-gray-700">
            <Icon icon="mdi:calendar-month-outline" class="text-xl text-accent" />
            <span class="text-sm">{{ formattedDate }}</span>
          </div>

          <div class="flex items-center gap-2 text-gray-700">
            <Icon icon="mdi:map-marker" class="text-xl text-accent" />
            <span class="text-sm">{{ event.lieu }}</span>
          </div>

          <div class="flex items-center gap-2 text-gray-700">
            <Icon icon="mdi:account-group-outline" class="text-xl text-accent" />
            <span class="text-sm">
              Places restantes :
              <span :class="event.placesRestantes > 0 ? 'text-green-600' : 'text-red-600 font-semibold'">
                {{ event.placesRestantes }}
              </span>
            </span>
          </div>

          <p class="text-gray-600 text-sm">{{ event.shortDesc }}</p>
        </div>

        <ReservationForm :event-id="event.id" />
      </div>
    </div>
  </div>
</template>

