<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { evenementsService } from '@/services/evenementsService.js'
import ReservationForm from '@/components/ReservationForm.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const event = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    event.value = await evenementsService.getById(route.params.id)
  } catch (e) {
    error.value = 'Événement non trouvé'
  }
})

const formattedDate = computed(() => {
  if (!event.value) return ''
  return format(new Date(event.value.date), 'dd MMMM yyyy à HH:mm', { locale: fr })
})

const formattedPrice = computed(() => {
  if (!event.value || !event.value.prix_par_personne) return 'Gratuit'
  return `${event.value.prix_par_personne} €`
})
</script>

<template>
  <div v-if="event" class="p-6 min-h-screen max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div class="space-y-6">
        <img
          :src="event.image"
          :alt="event.title"
          class="rounded-xl shadow-lg w-full max-h-96 object-cover"
        />

        <div>
          <h2 class="text-xl font-semibold text-primary mb-3">À propos de l'événement</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ event.long_desc }}</p>
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

          <!-- Affichage du prix -->
          <div class="flex items-center gap-2 text-gray-700">
            <Icon icon="mdi:currency-eur" class="text-xl text-accent" />
            <span class="text-sm">
              Prix par personne : <span class="font-semibold text-primary">{{ formattedPrice }}</span>
            </span>
          </div>

          <!-- Affichage des places restantes -->
          <div class="flex items-center gap-2 text-gray-700">
            <Icon icon="mdi:account-group-outline" class="text-xl text-accent" />
            <span class="text-sm">
              Places restantes :
              <span :class="event.places_restantes > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                {{ event.places_restantes }} / {{ event.places_total }}
              </span>
            </span>
          </div>

          <p class="text-gray-600 text-sm">{{ event.short_desc }}</p>
        </div>

        <!-- Affichage conditionnel du formulaire de réservation -->
        <div v-if="event.places_restantes > 0">
          <ReservationForm :event-id="event.id" />
        </div>
        <div v-else class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <Icon icon="mdi:alert-circle" class="text-red-500 text-2xl mb-2" />
          <p class="text-red-700 font-semibold">Événement complet</p>
          <p class="text-red-600 text-sm">Plus de places disponibles pour cet événement.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="text-red-600 text-center py-8">{{ error }}</div>
  <div v-else class="text-center py-8">Chargement...</div>
</template>

