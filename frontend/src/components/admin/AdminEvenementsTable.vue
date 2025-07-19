<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 class="text-xl font-semibold text-accent">Gestion des événements</h2>
        <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {{ evenementsFiltres.length }} événement{{ evenementsFiltres.length > 1 ? 's' : '' }}
        </span>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <button 
          @click="ajouterEvenement"
          class="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-accent transition flex items-center gap-2 font-medium"
          title="Ajouter un nouvel événement"
        >
          <Icon icon="mdi:plus" class="text-lg" />
          Nouvel événement
        </button>
        
        <div class="flex gap-3">
          <select 
            v-model="filtreStatut" 
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="À venir">À venir</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Annulé">Annulé</option>
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
            <th class="py-2 px-3">Événement</th>
            <th class="py-2 px-3">Date</th>
            <th class="py-2 px-3">Lieu</th>
            <th class="py-2 px-3">Places</th>
            <th class="py-2 px-3">Statut</th>
            <th class="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="evenement in evenementsFiltres" 
            :key="evenement.id"
            class="bg-background hover:bg-orange-50 rounded transition-colors"
          >
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ evenement.id }}
            </td>
            
            <td class="py-3 px-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    :src="evenement.image" 
                    :alt="evenement.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ evenement.title }}</p>
                  <p class="text-xs text-gray-500">{{ evenement.shortDesc }}</p>
                </div>
              </div>
            </td>
            
            <td class="py-3 px-3">
              <div>
                <p class="font-medium text-gray-800">{{ formatDate(evenement.date) }}</p>
                <p class="text-xs text-gray-500">{{ formatHour(evenement.date) }}</p>
              </div>
            </td>
            
            <td class="py-3 px-3 text-gray-800">
              {{ evenement.lieu }}
            </td>
            
            <td class="py-3 px-3">
              <div>
                <p class="font-medium text-gray-800">{{ evenement.placesRestantes }} / {{ evenement.placesTotal }}</p>
                <p class="text-xs text-gray-500">Restantes / Total</p>
              </div>
            </td>
            
            <td class="py-3 px-3">
              <span 
                :class="getStatutClass(getStatutFromDate(evenement.date))"
                class="px-2 py-1 rounded-full text-xs font-semibold"
              >
                {{ getStatutFromDate(evenement.date) }}
              </span>
            </td>
            
            <td class="py-3 px-3">
              <div class="flex gap-2">
                <button 
                  @click="voirDetails(evenement)"
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

      <div v-if="evenementsFiltres.length === 0" class="text-center py-8">
        <Icon icon="mdi:calendar-star" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-500 text-lg">
          {{ recherche || filtreStatut ? 'Aucun événement trouvé' : 'Aucun événement disponible' }}
        </p>
        <p class="text-sm text-gray-400 mt-2">
          {{ recherche || filtreStatut ? 'Essayez de modifier vos filtres' : 'Ajoutez votre premier événement' }}
        </p>
      </div>
    </div>

    <EvenementDetailModal 
      :show="showModal"
      :evenement="selectedEvenement"
      :mode-creation="modeCreation"
      @close="showModal = false"
      @update="updateEvenement"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import EvenementDetailModal from './EvenementDetailModal.vue'
import { evenementsService } from '@/services/evenementsService'

const evenements = ref([])
const loading = ref(false)
const error = ref('')

const getToken = () => localStorage.getItem('auth_token')

const chargerEvenements = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''
    const token = getToken()
    const response = await evenementsService.getAllEvenements(token, page, 20)
    evenements.value = response.evenements || []
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des événements'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  chargerEvenements(1)
})

const filtreStatut = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedEvenement = ref(null)
const modeCreation = ref(false)

const getStatutFromDate = (date) => {
  const now = new Date()
  const eventDate = new Date(date)
  
  if (eventDate > now) {
    return 'À venir'
  } else if (eventDate.toDateString() === now.toDateString()) {
    return 'En cours'
  } else {
    return 'Terminé'
  }
}

const evenementsFiltres = computed(() => {
  let result = evenements.value

  if (filtreStatut.value) {
    result = result.filter(event => getStatutFromDate(event.date) === filtreStatut.value)
  }

  if (recherche.value) {
    const term = recherche.value.toLowerCase()
    result = result.filter(event => 
      event.title.toLowerCase().includes(term) ||
      event.lieu.toLowerCase().includes(term) ||
      event.shortDesc.toLowerCase().includes(term) ||
      event.id.toString().includes(term)
    )
  }

  return result
})

const getStatutClass = (statut) => {
  const classes = {
    'À venir': 'bg-blue-100 text-blue-600',
    'En cours': 'bg-green-100 text-green-600',
    'Terminé': 'bg-orange-100 text-orange-600', 
    'Annulé': 'bg-red-100 text-red-600'
  }
  return classes[statut] || 'bg-gray-100 text-gray-600'
}

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
}

const formatHour = (date) => {
  return format(new Date(date), 'HH:mm', { locale: fr })
}

const voirDetails = (evenement) => {
  selectedEvenement.value = evenement
  modeCreation.value = false
  showModal.value = true
}

const ajouterEvenement = () => {
  selectedEvenement.value = {
    id: null,
    title: '',
    date: '',
    lieu: '',
    image: '',
    description: '',
    shortDesc: '',
    longDesc: '',
    placesTotal: 50,
    placesRestantes: 50
  }
  modeCreation.value = true
  showModal.value = true
}

const creerEvenement = (nouvelEvenement) => {
  const nouvelId = Math.max(...evenements.value.map(event => event.id)) + 1
  
  const evenementComplet = {
    ...nouvelEvenement,
    id: nouvelId,
    placesRestantes: nouvelEvenement.placesTotal 
  }
  
  evenements.value.unshift(evenementComplet)
  
  alert(`Nouvel événement "${evenementComplet.title}" créé avec succès !`)
}

const updateEvenement = (updates) => {
  if (modeCreation.value) {
    creerEvenement(updates)
  } else {
    const index = evenements.value.findIndex(event => event.id === updates.id)
    if (index !== -1) {
      evenements.value[index] = { ...evenements.value[index], ...updates }
      alert(`Événement "${evenements.value[index].title}" mis à jour !`)
    }
  }
}
</script>