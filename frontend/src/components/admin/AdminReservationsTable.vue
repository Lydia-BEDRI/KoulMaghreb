<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 class="text-xl font-semibold text-accent">Gestion des réservations</h2>
        <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {{ reservationsFiltrees.length }} réservation{{ reservationsFiltrees.length > 1 ? 's' : '' }}
        </span>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
    
        <div class="flex gap-3">
          <select 
            v-model="filtreStatut" 
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="Annulée">Annulée</option>
            <option value="Terminée">Terminée</option>
          </select>
          <input 
            v-model="recherche" 
            placeholder="Rechercher..." 
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
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
                <p class="font-medium text-gray-800">{{ reservation.client.nom }}</p>
                <p class="text-xs text-gray-500">{{ reservation.client.email }}</p>
              </div>
            </td>
            
            <td class="py-3 px-3">
              <div>
                <p class="font-medium text-gray-800">{{ reservation.evenement.titre }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(reservation.evenement.date) }}</p>
              </div>
            </td>
            
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ reservation.nombrePlaces }}
            </td>
            
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ reservation.montantTotal.toFixed(2) }}€
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
          {{ recherche || filtreStatut ? 'Essayez de modifier vos filtres' : 'Ajoutez votre première réservation' }}
        </p>
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
import { ref, computed } from 'vue'
import { reservations as reservationsData } from '@/data/reservations'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import ReservationDetailModal from './ReservationDetailModal.vue'

const reservations = ref(reservationsData)
const filtreStatut = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedReservation = ref(null)
const modeCreation = ref(false)

const reservationsFiltrees = computed(() => {
  let result = reservations.value

  if (filtreStatut.value) {
    result = result.filter(rsv => rsv.statut === filtreStatut.value)
  }

  if (recherche.value) {
    const term = recherche.value.toLowerCase()
    result = result.filter(rsv => 
      rsv.client.nom.toLowerCase().includes(term) ||
      rsv.numeroReservation.toLowerCase().includes(term) ||
      rsv.client.email.toLowerCase().includes(term) ||
      rsv.evenement.titre.toLowerCase().includes(term) ||
      rsv.id.toString().includes(term)
    )
  }

  return result
})

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
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
}

const voirDetails = (reservation) => {
  selectedReservation.value = reservation
  modeCreation.value = false
  showModal.value = true
}

const ajouterReservation = () => {
  selectedReservation.value = {
    id: null,
    numeroReservation: '',
    user_id: null,
    client: {
      nom: '',
      email: '',
      telephone: ''
    },
    evenement: {
      id: null,
      titre: '',
      date: '',
      lieu: ''
    },
    nombrePlaces: 1,
    statut: 'En attente',
    created_at: new Date().toISOString(),
    notesAdmin: '',
    montantTotal: 0,
    acompteVerse: 0
  }
  modeCreation.value = true
  showModal.value = true
}

const creerReservation = (nouvelleReservation) => {
  const nouvelId = Math.max(...reservations.value.map(rsv => rsv.id)) + 1
  
  const nouveauNumero = `RSV-${String(nouvelId).padStart(3, '0')}`
  
  const reservationComplete = {
    ...nouvelleReservation,
    id: nouvelId,
    numeroReservation: nouveauNumero,
    created_at: new Date().toISOString()
  }
  
  reservations.value.unshift(reservationComplete)
  
  alert(`Nouvelle réservation ${nouveauNumero} créée avec succès !`)
}

const updateReservation = (updates) => {
  if (modeCreation.value) {
    creerReservation(updates)
  } else {
    const index = reservations.value.findIndex(rsv => rsv.id === updates.id)
    if (index !== -1) {
      reservations.value[index] = { ...reservations.value[index], ...updates }
      alert(`Réservation ${reservations.value[index].numeroReservation} mise à jour !`)
    }
  }
}
</script>