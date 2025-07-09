<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 class="text-xl font-semibold text-accent">Gestion des commandes</h2>
        <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {{ commandesFiltrees.length }} commande{{ commandesFiltrees.length > 1 ? 's' : '' }}
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
            <option value="En préparation">En préparation</option>
            <option value="Prête">Prête</option>
            <option value="En livraison">En livraison</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
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
            v-for="commande in commandesFiltrees" 
            :key="commande.id"
            class="bg-background hover:bg-orange-50 rounded transition-colors"
          >
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ commande.id }}
            </td>
            
            <td class="py-3 px-3 font-semibold text-accent">
              {{ commande.numeroCommande }}
            </td>
            
            <td class="py-3 px-3">
              <div>
                <p class="font-medium text-gray-800">{{ commande.client.nom }}</p>
                <p class="text-xs text-gray-500">{{ commande.client.email }}</p>
              </div>
            </td>
            
            <td class="py-3 px-3 font-semibold text-gray-800">
              {{ commande.total.toFixed(2) }}€
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

      <div v-if="commandesFiltrees.length === 0" class="text-center py-8">
        <Icon icon="mdi:package-variant" class="text-6xl text-gray-300 mb-4" />
        <p class="text-gray-500 text-lg">
          {{ recherche || filtreStatut ? 'Aucune commande trouvée' : 'Aucune commande disponible' }}
        </p>
        <p class="text-sm text-gray-400 mt-2">
          {{ recherche || filtreStatut ? 'Essayez de modifier vos filtres' : 'Ajoutez votre première commande' }}
        </p>
      </div>
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
import { ref, computed } from 'vue'
import { commandes as commandesData } from '@/data/commandes'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import CommandeDetailModal from './CommandeDetailModal.vue'

const commandes = ref(commandesData)
const filtreStatut = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedCommande = ref(null)

const commandesFiltrees = computed(() => {
  let result = commandes.value

  if (filtreStatut.value) {
    result = result.filter(cmd => cmd.statut === filtreStatut.value)
  }

  if (recherche.value) {
    const term = recherche.value.toLowerCase()
    result = result.filter(cmd => 
      cmd.client.nom.toLowerCase().includes(term) ||
      cmd.numeroCommande.toLowerCase().includes(term) ||
      cmd.client.email.toLowerCase().includes(term) ||
      cmd.id.toString().includes(term)
    )
  }

  return result
})

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

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
}

const voirDetails = (commande) => {
  selectedCommande.value = commande
  showModal.value = true
}

const updateCommande = (updates) => {
  const index = commandes.value.findIndex(cmd => cmd.id === updates.id)
  if (index !== -1) {
    commandes.value[index] = { ...commandes.value[index], ...updates }
    alert(`Commande ${commandes.value[index].numeroCommande} mise à jour !`)
  }
}
</script>