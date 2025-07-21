<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 class="text-xl font-semibold text-accent">Gestion des réservations</h2>
        <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {{ totalReservations }} réservation{{ totalReservations > 1 ? 's' : '' }}
        </span>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="flex gap-3">
          <select 
            v-model="filtreStatut" 
            @change="chargerReservations(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="Annulée">Annulée</option>
          </select>
          <input 
            v-model="recherche" 
            @input="debounceSearch"
            placeholder="Rechercher..." 
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <Icon icon="mdi:loading" class="text-4xl text-primary animate-spin mb-4" />
      <p class="text-gray-600">Chargement des réservations...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-red-800">
        <Icon icon="mdi:alert-circle" class="text-xl" />
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <table class="w-full text-left text-sm border-separate border-spacing-y-2">
        <thead class="text-primary uppercase text-xs tracking-wide">
          <tr>
            <th class="py-2 px-3">ID</th>
            <th class="py-2 px-3">N° Réservation</th>
            <th class="py-2 px-3">Client</th>
            <th class="py-2 px-3">Événement</th>
            <th class="py-2 px-3">Places</th>
            <th class="py-2 px-3">Total</th>
            <th class="py-2 px-3">Statut</th>
            <th class="py-2 px-3">Date création</th>
            <th class="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="reservation in reservationsFiltrees" 
            :key="reservation.id"
            class="bg-background hover:bg-orange-50 rounded transition-colors"
          >
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ reservation.id }}
            </td>
            
            <td class="py-3 px-3 font-semibold text-accent">
              {{ reservation.numeroReservation }}
            </td>
            
            <td class="py-3 px-3">
              <div>
                <p class="font-medium text-gray-800">{{ reservation.client?.nom || 'Client' }}</p>
                <p class="text-xs text-gray-500">{{ reservation.client?.email || 'Email non renseigné' }}</p>
              </div>
            </td>
            
            <td class="py-3 px-3">
              <div>
                <p class="font-medium text-gray-800">{{ reservation.evenement?.titre || 'Événement supprimé' }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(reservation.evenement?.date) }}</p>
              </div>
            </td>
            
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ reservation.nombrePlaces }}
            </td>
            
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ reservation.montantTotal?.toFixed(2) || '0.00' }}€
            </td>
            
            <td class="py-3 px-3">
              <span 
                :class="getStatutClass(reservation.statut)"
                class="px-2 py-1 rounded-full text-xs font-semibold"
              >
                {{ reservation.statut }}
              </span>
            </td>
            
            <td class="py-3 px-3 text-gray-600">
              {{ formatDate(reservation.created_at) }}
            </td>
            
            <td class="py-3 px-3">
              <div class="flex gap-2">
                <button 
                  @click="voirDetails(reservation)"
                  class="bg-primary text-white px-3 py-1 rounded-lg text-xs hover:bg-accent transition"
                  title="Voir détails"
                >
                  Détails
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="reservationsFiltrees.length === 0" class="text-center py-8">
        <Icon icon="mdi:calendar-heart" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-500 text-lg">
          {{ recherche || filtreStatut ? 'Aucune réservation trouvée' : 'Aucune réservation disponible' }}
        </p>
        <p class="text-sm text-gray-400 mt-2">
          {{ recherche || filtreStatut ? 'Essayez de modifier vos filtres' : 'Les réservations apparaîtront ici' }}
        </p>
      </div>

      <div v-if="pagination && pagination.pages > 1" class="flex justify-center items-center gap-2 mt-6">
        <button 
          @click="changerPage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        
        <span class="text-sm text-gray-600">
          Page {{ pagination.page }} sur {{ pagination.pages }}
        </span>
        
        <button 
          @click="changerPage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.pages"
          class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>

    <ReservationDetailModal 
      :show="showModal"
      :reservation="selectedReservation"
      :mode-creation="modeCreation"
      @close="showModal = false"
      @update="updateReservation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import ReservationDetailModal from './ReservationDetailModal.vue'
import { useToast } from 'vue-toastification'
import { reservationsService } from '@/services/reservationsService'

const toast = useToast()

const reservationsData = ref([])
const loading = ref(true)
const error = ref('')
const totalReservations = ref(0)
const pagination = ref(null)

const filtreStatut = ref('')
const recherche = ref('')
const searchTimeout = ref(null)

const showModal = ref(false)
const selectedReservation = ref(null)
const modeCreation = ref(false)

const getToken = () => localStorage.getItem('auth_token')

const chargerReservations = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''
    
    const currentToken = getToken()
    if (!currentToken) {
      throw new Error('Token d\'authentification manquant')
    }

    const filters = {}
    if (filtreStatut.value) filters.statut = filtreStatut.value
    if (recherche.value) filters.search = recherche.value

    const response = await reservationsService.getAllReservations(currentToken, page, 10, filters)
    
    reservationsData.value = response.reservations || []
    pagination.value = response.pagination
    totalReservations.value = response.pagination?.total || 0

  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des réservations'
    
    if (err.message.includes('401') || err.message.includes('403')) {
      toast.error('Session expirée, veuillez vous reconnecter')
    }
  } finally {
    loading.value = false
  }
}

const reservationsFiltrees = computed(() => {
  return reservationsData.value
})

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    chargerReservations(1)
  }, 500)
}

const changerPage = (nouvellePage) => {
  if (nouvellePage >= 1 && pagination.value && nouvellePage <= pagination.value.pages) {
    chargerReservations(nouvellePage)
  }
}

const getStatutClass = (statut) => {
  const classes = {
    'En attente': 'bg-yellow-100 text-yellow-600',
    'Confirmée': 'bg-green-100 text-green-600',
    'Annulée': 'bg-red-100 text-red-600',
    'Terminée': 'bg-blue-100 text-blue-600'
  }
  return classes[statut] || 'bg-gray-100 text-gray-600'
}

const formatDate = (date) => {
  if (!date) return 'Non disponible'
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
}

const voirDetails = (reservation) => {
  selectedReservation.value = reservation
  modeCreation.value = false
  showModal.value = true
}

const updateReservation = async (updates) => {
  try {
    const currentToken = getToken()
    if (!currentToken) {
      throw new Error('Token d\'authentification manquant')
    }

    const apiData = {
      statut: updates.statut,
      notes_admin: updates.notesAdmin
    }

    await reservationsService.updateReservation(updates.id, apiData, currentToken)
    
    toast.success('Réservation mise à jour avec succès !')
    
    await chargerReservations(pagination.value?.page || 1)
    
  } catch (err) {
    toast.error(err.message || 'Erreur lors de la mise à jour de la réservation')
  }
}

onMounted(() => {
  chargerReservations(1)
})
</script>