<template>
  <div class="p-6 bg-background min-h-screen">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-primary">Mes Réservations</h1>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-600">Chargement des réservations...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-6">
        <Icon icon="mdi:alert-circle" class="w-12 h-12 mx-auto text-red-500 mb-3" />
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="chargerReservations"
          class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Réessayer
        </button>
      </div>
    </div>

    <div v-else-if="reservations.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-xl p-8">
        <Icon icon="mdi:calendar-remove" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Aucune réservation</h3>
        <p class="text-gray-500 mb-6">Vous n'avez pas encore effectué de réservation</p>
        <router-link 
          to="/evenements" 
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition inline-flex items-center gap-2"
        >
          <Icon icon="mdi:calendar-plus" class="w-4 h-4" />
          Découvrir nos événements
        </router-link>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="reservation in reservations"
        :key="reservation.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
      >
        <!-- En-tête -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-primary mb-1">
              {{ reservation.evenement_titre || 'Événement' }}
            </h3>
            <p class="text-sm text-gray-600">
              Réservation n° {{ reservation.numero_reservation }}
            </p>
          </div>
          
          <div class="flex items-center gap-3">
            <span 
              :class="getStatusStyle(reservation.statut)"
              class="px-3 py-1 rounded-full text-xs font-medium"
            >
              {{ getStatusLabel(reservation.statut) }}
            </span>
            
            <button
              v-if="reservation.statut === 'En attente' && getConditionsAnnulation(reservation).possible"
              @click="annulerReservation(reservation)"
              :disabled="annulationLoading"
              class="group relative w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300 border border-red-200 hover:border-red-500 hover:shadow-lg"
              :title="'Annuler la réservation'"
            >
              <Icon 
                v-if="!annulationLoading" 
                icon="mdi:close" 
                class="w-4 h-4"
              />
              <Icon 
                v-else 
                icon="mdi:loading" 
                class="w-4 h-4 animate-spin"
              />
            </button>
          </div>
        </div>

        <!-- Détails -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="space-y-2 text-sm">
            <div v-if="reservation.evenement_date" class="flex items-center gap-2">
              <Icon icon="mdi:calendar" class="w-4 h-4 text-gray-500" />
              <span>{{ formatDate(reservation.evenement_date) }}</span>
            </div>
            <div v-if="reservation.evenement_lieu" class="flex items-center gap-2">
              <Icon icon="mdi:map-marker" class="w-4 h-4 text-gray-500" />
              <span>{{ reservation.evenement_lieu }}</span>
            </div>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:account-group" class="w-4 h-4 text-gray-500" />
              <span>{{ reservation.nombre_places }} place{{ reservation.nombre_places > 1 ? 's' : '' }}</span>
            </div>
            <div v-if="reservation.montant_total" class="flex items-center gap-2">
              <Icon icon="mdi:currency-eur" class="w-4 h-4 text-gray-500" />
              <span class="font-semibold">{{ parseFloat(reservation.montant_total).toFixed(2) }}€</span>
            </div>
          </div>
        </div>

        <!-- Conditions d'annulation pour réservations en attente -->
        <div v-if="reservation.statut === 'En attente'" class="border-t pt-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-2">
              <Icon icon="mdi:information" class="w-4 h-4 text-yellow-600" />
              <span class="text-sm font-medium text-yellow-800">Conditions d'annulation</span>
            </div>
            <div class="text-sm text-yellow-700">
              <p><strong>Remboursement :</strong> {{ getConditionsAnnulation(reservation).pourcentage }}%</p>
              <p class="text-xs mt-1">{{ getConditionsAnnulation(reservation).description }}</p>
            </div>
          </div>
        </div>

        <!-- Message pour autres statuts -->
        <div v-else-if="reservation.statut === 'Confirmée'" class="border-t pt-4">
          <div class="flex items-center gap-2 text-green-700 text-sm bg-green-50 p-3 rounded-lg">
            <Icon icon="mdi:check-circle" class="w-4 h-4" />
            <span>Réservation confirmée</span>
          </div>
        </div>

        <div v-else-if="reservation.statut === 'Annulée'" class="border-t pt-4">
          <div class="flex items-center gap-2 text-red-700 text-sm bg-red-50 p-3 rounded-lg">
            <Icon icon="mdi:cancel" class="w-4 h-4" />
            <span>Réservation annulée - Remboursement en cours</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { reservationsService } from '@/services/reservationsService'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import { useSeo } from '@/composables/useSeo.js'

const { token } = useAuth()
const toast = useToast()

const reservations = ref([])
const loading = ref(false)
const error = ref(null)
const annulationLoading = ref(false)

const chargerReservations = async () => {
  loading.value = true
  error.value = null
  
  try {
    const authToken = token?.value || localStorage.getItem('auth_token')
    
    if (!authToken) {
      throw new Error('Non authentifié')
    }
    
    const response = await reservationsService.getMesReservations(authToken)
    
    if (response.reservations) {
      reservations.value = response.reservations
    } else {
      reservations.value = []
    }
    
  } catch (err) {
    console.error('Erreur chargement réservations:', err)
    error.value = err.message
    toast.error('Erreur lors du chargement des réservations')
  } finally {
    loading.value = false
  }
}

const getStatusStyle = (statut) => {
  switch (statut?.toLowerCase()) {
    case 'confirmée':
      return 'bg-green-100 text-green-800'
    case 'en attente':
      return 'bg-yellow-100 text-yellow-800'
    case 'annulée':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (statut) => {
  switch (statut?.toLowerCase()) {
    case 'confirmée':
      return 'Confirmée'
    case 'en attente':
      return 'En attente'
    case 'annulée':
      return 'Annulée'
    default:
      return 'Inconnu'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date non définie'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

const getConditionsAnnulation = (reservation) => {
  if (reservation.statut !== 'En attente') {
    return { possible: false, pourcentage: 0, description: 'Annulation impossible' }
  }

  const maintenant = new Date()
  const dateReservation = new Date(reservation.created_at)
  const dateEvenement = new Date(reservation.evenement_date)
  
  const heuresEcoulees = (maintenant - dateReservation) / (1000 * 60 * 60)
  const heuresAvantEvenement = (dateEvenement - maintenant) / (1000 * 60 * 60)

  // Droit de rétractation (14 jours)
  if (heuresEcoulees <= 336) {
    return {
      possible: true,
      pourcentage: 100,
      description: 'Remboursement intégral (droit de rétractation)'
    }
  }
  
  // Annulation anticipée (+ de 48h)
  if (heuresAvantEvenement >= 48) {
    return {
      possible: true,
      pourcentage: 80,
      description: 'Frais d\'annulation de 20%'
    }
  }
  
  // Annulation tardive (24h à 48h)
  if (heuresAvantEvenement >= 24) {
    return {
      possible: true,
      pourcentage: 50,
      description: 'Frais d\'annulation de 50%'
    }
  }
  
  // Trop tard
  return {
    possible: false,
    pourcentage: 0,
    description: 'Annulation impossible (moins de 24h)'
  }
}

const annulerReservation = async (reservation) => {
  const conditions = getConditionsAnnulation(reservation)
  
  if (!conditions.possible) {
    toast.error(conditions.description)
    return
  }

  const montantRemboursement = (parseFloat(reservation.montant_total) * conditions.pourcentage / 100).toFixed(2)

  const confirmation = confirm(`
Annuler la réservation ${reservation.numero_reservation} ?

Événement : ${reservation.evenement_titre}
Montant payé : ${parseFloat(reservation.montant_total).toFixed(2)}€
Remboursement : ${montantRemboursement}€ (${conditions.pourcentage}%)

${conditions.description}

Confirmer l'annulation ?`)

  if (!confirmation) return

  try {
    annulationLoading.value = true
    
    const authToken = token?.value || localStorage.getItem('auth_token')
    await reservationsService.annulerReservation(reservation.id, authToken)
    
    toast.success(`Réservation annulée - Remboursement de ${montantRemboursement}€`)
    
    await chargerReservations()
    
  } catch (err) {
    toast.error(err.message || 'Erreur lors de l\'annulation')
  } finally {
    annulationLoading.value = false
  }
}

onMounted(() => {
  chargerReservations()
})

useSeo({
  title: 'Mes réservations - KoulMaghreb',
  description: "Consultez et gérez vos réservations d'événements culinaires maghrébins sur KoulMaghreb. Annulez ou suivez vos réservations facilement."
})
</script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(135deg, rgba(var(--color-primary), 0.05) 0%, rgba(var(--color-accent), 0.05) 100%);
}
</style>