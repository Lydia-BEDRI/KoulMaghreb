<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  event: Object,
})

const formattedDate = computed(() => {
  return format(new Date(props.event.date), 'dd MMMM yyyy à HH:mm', { locale: fr })
})
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
  >
    <div class="aspect-video overflow-hidden">
      <img
        :src="event.image"
        :alt="event.title"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-4 space-y-3">
      <div class="flex flex-col gap-1 text-gray-700 text-sm">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:food" class="text-accent w-4 h-4" />
          <span class="font-semibold">{{ event.title }}</span>
        </div>
        <div class="flex items-center gap-2">
          <CalendarDaysIcon class="w-4 h-4 text-accent" />
          <span>{{ formattedDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <MapPinIcon class="w-4 h-4 text-accent" />
          <span>{{ event.lieu }}</span>
        </div>
      </div>

      <p class="text-gray-600 text-sm">
        {{ event.shortDesc }}
      </p>

      <div class="flex justify-end pt-2">
        <router-link
          :to="{ name: 'Événement Détail', params: { id: event.id } }"
          class="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
        >
          Voir les détails
        </router-link>
      </div>
    </div>
  </div>
</template>
