<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { evenementsService } from '@/services/evenementsService.js'
import { Icon } from '@iconify/vue'
import { usePanier } from '@/composables/usePanier'
import { useToast } from 'vue-toastification'
import { useSeo } from '@/composables/useSeo.js'

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

const { ajouterAuPanier } = usePanier()
const toast = useToast()

const nombrePlaces = ref(1)
const ajoutLoading = ref(false)

const ajouterReservationAuPanier = async () => {
  try {
    if (!event.value?.id) {
      toast.error('ID de l\'événement manquant')
      return
    }
    
    ajoutLoading.value = true

    await ajouterAuPanier({
      type: 'reservation',
      evenement_id: event.value.id,
      quantite: nombrePlaces.value
    })

    toast.success(`${nombrePlaces.value} place(s) ajoutée(s) au panier !`)
    
  } catch (error) {
    console.error('Erreur ajout panier:', error)
    toast.error(error.message || 'Erreur lors de l\'ajout au panier')
  } finally {
    ajoutLoading.value = false
  }
}

const placesDisponibles = computed(() => {
  if (!event.value?.places_restantes) return 0
  return Math.min(event.value.places_restantes, 10) 
})

useSeo({
  title: event.value ? `${event.value.title} - Événement - KoulMaghreb` : 'Événement - KoulMaghreb',
  description: event.value ? event.value.short_desc || event.value.title : "Détail d'un événement maghrébin organisé par KoulMaghreb."
})
</script>

<template>
  <section aria-label="Détail de l'événement" class="bg-gray-50"> 
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

          <div class="flex items-center gap-2 text-gray-700">
            <Icon icon="mdi:currency-eur" class="text-xl text-accent" />
            <span class="text-sm">
              Prix par personne : <span class="font-semibold text-primary">{{ formattedPrice }}</span>
            </span>
          </div>

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

        <div class="bg-white p-6 rounded-2xl shadow">
          <h3 class="text-xl font-semibold mb-4">Réservation</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre de places
              </label>
              <select 
                v-model="nombrePlaces" 
                class="w-full p-3 border border-gray-300 rounded-lg"
                :disabled="placesDisponibles === 0"
              >
                <option v-if="placesDisponibles === 0" value="0">Aucune place disponible</option>
                <option v-else v-for="n in placesDisponibles" :key="n" :value="n">
                  {{ n }} place{{ n > 1 ? 's' : '' }}
                </option>
              </select>
            </div>

            <div v-if="event.prix_par_personne" class="text-sm text-gray-600">
              <p>Prix par personne : {{ event.prix_par_personne }}€</p>
              <p class="font-semibold">
                Total : {{ (nombrePlaces * parseFloat(event.prix_par_personne || 0)).toFixed(2) }}€
              </p>
            </div>

            <button
              @click="ajouterReservationAuPanier"
              :disabled="nombrePlaces === 0 || ajoutLoading || placesDisponibles === 0"
              class="w-full bg-primary text-white py-3 px-6 rounded-xl hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div v-if="ajoutLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <Icon v-else icon="mdi:cart-plus" class="w-5 h-5" />
              <span v-if="placesDisponibles === 0">Plus de places disponibles</span>
              <span v-else-if="ajoutLoading">Ajout en cours...</span>
              <span v-else>Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="text-red-600 text-center py-8">{{ error }}</div>
  <div v-else class="text-center py-8">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <p class="mt-2 text-gray-600">Chargement de l'événement...</p>
  </div>
</section>
</template>

