<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 class="text-xl font-semibold text-accent">Gestion des commandes</h2>
        <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {{ pagination?.total || 0 }} commande{{ (pagination?.total || 0) > 1 ? 's' : '' }}
        </span>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="flex gap-3">
          <select 
            v-model="filtreStatut" 
            @change="chargerCommandes(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En préparation">En préparation</option>
            <option value="Prête">Prête</option>
            <option value="En livraison">En livraison</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
          </select>
          <input 
            v-model="recherche"
            @input="rechercherCommandes"
            placeholder="Rechercher..." 
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <button 
          @click="chargerCommandes(pagination?.page || 1)"
          :disabled="loading"
          class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition text-sm disabled:opacity-50"
        >
          <Icon icon="mdi:refresh" :class="{ 'animate-spin': loading }" />
          Actualiser
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600">Chargement des commandes...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 text-red-600">
        <Icon icon="mdi:alert-circle" class="text-4xl mb-2" />
        <p class="mb-4">{{ error }}</p>
        <button 
          @click="chargerCommandes(1)" 
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
        >
          Réessayer
        </button>
      </div>

      <table v-else-if="commandes.length > 0" class="w-full text-left text-sm border-separate border-spacing-y-2">
        <thead class="text-primary uppercase text-xs tracking-wide">
          <tr>
            <th class="py-2 px-3">ID</th>
            <th class="py-2 px-3">N° Commande</th>
            <th class="py-2 px-3">Client</th>
            <th class="py-2 px-3">Total</th>
            <th class="py-2 px-3">Statut</th>
            <th class="py-2 px-3">Date</th>
            <th class="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="commande in commandes" 
            :key="commande.id"
            class="bg-background hover:bg-orange-50 rounded transition-colors"
          >
            <td class="py-3 px-3 font-semibold text-gray-800">
              #{{ commande.id }}
            </td>
            
            <td class="py-3 px-3 font-semibold text-accent">
              {{ commande.numero_commande }}
            </td>
            
            <td class="py-3 px-3">
              <div v-if="commande.client">
                <p class="font-medium text-gray-800">{{ commande.client.nom }}</p>
                <p class="text-xs text-gray-500">{{ commande.client.email }}</p>
              </div>
              <div v-else class="text-gray-400 italic">
                Client inconnu
              </div>
            </td>
            
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ parseFloat(commande.total).toFixed(2) }}€
            </td>
            
            <td class="py-3 px-3">
              <span 
                :class="getStatutClass(commande.statut)"
                class="px-2 py-1 rounded-full text-xs font-semibold"
              >
                {{ commande.statut }}
              </span>
            </td>
            
            <td class="py-3 px-3 text-gray-600">
              {{ formatDate(commande.created_at) }}
            </td>
            
            <td class="py-3 px-3">
              <div class="flex gap-2">
                <button 
                  @click="voirDetails(commande)"
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

      <div v-else class="text-center py-8">
        <Icon icon="mdi:package-variant" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-500 text-lg">
          {{ recherche || filtreStatut ? 'Aucune commande trouvée' : 'Aucune commande disponible' }}
        </p>
        <p class="text-sm text-gray-400 mt-2">
          {{ recherche || filtreStatut ? 'Essayez de modifier vos filtres' : 'Les commandes apparaîtront ici' }}
        </p>
      </div>
    </div>

    <div v-if="pagination && pagination.pages > 1" class="flex justify-center items-center gap-2">
      <button
        @click="chargerCommandes(pagination.page - 1)"
        :disabled="pagination.page <= 1 || loading"
        class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
      >
        Précédent
      </button>
      
      <span class="px-4 py-2 text-gray-700">
        Page {{ pagination.page }} sur {{ pagination.pages }}
      </span>
      
      <button
        @click="chargerCommandes(pagination.page + 1)"
        :disabled="pagination.page >= pagination.pages || loading"
        class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
      >
        Suivant
      </button>
    </div>

    <CommandeDetailModal 
      :show="showModal"
      :commande="selectedCommande"
      @close="showModal = false"
      @update="updateCommande"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import { adminCommandesService } from '@/services/adminCommandesService'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import CommandeDetailModal from './CommandeDetailModal.vue'

const { isAdmin } = useAuth()
const toast = useToast()

const commandes = ref([])
const pagination = ref(null)
const loading = ref(false)
const error = ref(null)
const filtreStatut = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedCommande = ref(null)

let rechercheTimeout = null

const token = computed(() => localStorage.getItem('auth_token'))

const chargerCommandes = async (page = 1) => {
  if (!token.value || !isAdmin.value) {
    error.value = 'Accès non autorisé'
    return
  }

  try {
    loading.value = true
    error.value = null

    const response = await adminCommandesService.getAllCommandes(
      token.value,
      page,
      20,
      filtreStatut.value
    )

    commandes.value = response.commandes || []
    pagination.value = response.pagination

    if (commandes.value.length === 0 && page > 1) {
      await chargerCommandes(1)
    }

  } catch (err) {
    console.error('Erreur chargement commandes:', err)
    error.value = err.message || 'Erreur lors du chargement des commandes'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const rechercherCommandes = () => {
  clearTimeout(rechercheTimeout)
  rechercheTimeout = setTimeout(() => {
    chargerCommandes(1)
  }, 500)
}

const getStatutClass = (statut) => {
  const classes = {
    'En attente': 'bg-yellow-100 text-yellow-600',
    'En préparation': 'bg-blue-100 text-blue-600',
    'Prête': 'bg-purple-100 text-purple-600',
    'En livraison': 'bg-orange-100 text-orange-600',
    'Livrée': 'bg-green-100 text-green-600',
    'Annulée': 'bg-red-100 text-red-600'
  }
  return classes[statut] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr })
  } catch (err) {
    return 'Date invalide'
  }
}

const voirDetails = (commande) => {
  selectedCommande.value = commande
  showModal.value = true
}

const updateCommande = async (updates) => {
  try {
    await adminCommandesService.updateCommande(
      token.value,
      updates.id,
      {
        statut: updates.statut,
        notes_admin: updates.notesAdmin
      }
    )

    toast.success('Commande mise à jour avec succès !')
    
    await chargerCommandes(pagination.value?.page || 1)
    
    showModal.value = false

  } catch (err) {
    console.error('Erreur mise à jour commande:', err)
    toast.error(err.message || 'Erreur lors de la mise à jour')
  }
}

onMounted(() => {
  chargerCommandes(1)
})
</script>