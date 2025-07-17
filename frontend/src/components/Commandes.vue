<template>
  <div class="p-6 bg-background min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-primary">Mes commandes</h1>
      
      <div class="flex gap-3">
        <select 
          v-model="filtreStatut" 
          @change="chargerCommandes"
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
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-600">Chargement de vos commandes...</p>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-600">
      <p>{{ error }}</p>
      <button 
        @click="chargerCommandes" 
        class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
      >
        Réessayer
      </button>
    </div>

    <div v-else-if="commandes.length" class="space-y-6">
      <div
        v-for="commande in commandes"
        :key="commande.id"
        class="bg-white rounded-2xl shadow border border-gray-200 p-6 transition hover:shadow-lg"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold text-primary">
              Commande {{ commande.numero_commande }}
            </p>
            <p class="text-sm text-gray-600">
              Date : {{ formatDate(commande.created_at) }} | Total : {{ parseFloat(commande.total || 0).toFixed(2) }}€
            </p>
            <p class="text-sm mt-1" :class="getStatutColor(commande.statut)">
              Statut : {{ commande.statut }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <button
              class="bg-accent text-white px-4 py-2 rounded-xl hover:bg-primary transition"
              @click="toggleDetails(commande.id)"
            >
              {{ commandesDetails[commande.id] ? 'Masquer' : 'Détails' }}
            </button>
            
            <button
              v-if="commande.statut === 'En attente'"
              class="group relative w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300 border border-red-200 hover:border-red-500 hover:shadow-lg"
              @click="annulerCommande(commande)"
              :disabled="annulationLoading"
              :title="'Annuler la commande'"
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

        <div v-if="commandesDetails[commande.id]" class="mt-4 border-t pt-4 space-y-3">
          <div v-if="!commande.items || commande.items.length === 0" class="text-center py-4 text-gray-500">
            Aucun détail d'article disponible pour cette commande
          </div>
          
          <div
            v-for="item in commande.items"
            :key="`${commande.id}-${item.nom_plat}`"
            class="flex items-center justify-between border p-3 rounded-xl bg-neutral"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <Icon icon="mdi:food" class="text-2xl text-gray-400" />
              </div>
              <div>
                <p class="text-base font-medium">{{ item.nom_plat || 'Article inconnu' }}</p>
                <p class="text-sm text-gray-600">
                  {{ parseInt(item.quantite || 0) }} × {{ parseFloat(item.prix || 0).toFixed(2) }}€
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-base font-semibold">
                {{ (parseFloat(item.prix || 0) * parseInt(item.quantite || 0)).toFixed(2) }}€
              </p>
            </div>
          </div>
          
          <div v-if="commande.notes_admin" class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm font-medium text-blue-800">Note de l'équipe :</p>
            <p class="text-sm text-blue-600">{{ commande.notes_admin }}</p>
          </div>
        </div>
      </div>

      <div v-if="pagination && pagination.pages > 1" class="flex justify-center items-center gap-2 mt-8">
        <button
          @click="changerPage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Précédent
        </button>
        
        <span class="px-4 py-2 text-gray-700">
          Page {{ pagination.page }} sur {{ pagination.pages }}
        </span>
        
        <button
          @click="changerPage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.pages"
          class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <Icon icon="mdi:package-variant-closed" class="text-6xl text-gray-300 mb-4" />
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucune commande trouvée</h3>
      <p class="text-gray-500 mb-6">
        {{ filtreStatut ? 'Aucune commande avec ce statut' : 'Vous n\'avez pas encore passé de commande' }}
      </p>
      <button
        @click="$router.push('/catalogue')"
        class="bg-primary text-white px-6 py-3 rounded-xl hover:bg-accent transition"
      >
        Découvrir nos plats
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { commandesService } from '@/services/commandesService'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const toast = useToast()
const { user, token, isAuthenticated } = useAuth()

const commandes = ref([])
const loading = ref(false)
const error = ref(null)
const annulationLoading = ref(false)
const filtreStatut = ref('')
const pagination = ref(null)
const commandesDetails = reactive({})

const getToken = () => {
  return token?.value || localStorage.getItem('auth_token')
}

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateString
  }
}

const getStatutColor = (statut) => {
  const colors = {
    'En attente': 'text-yellow-600',
    'En préparation': 'text-blue-600',
    'Prête': 'text-purple-600',
    'En livraison': 'text-orange-600',
    'Livrée': 'text-green-600',
    'Annulée': 'text-red-600'
  }
  return colors[statut] || 'text-gray-600'
}

const chargerCommandes = async (page = 1) => {
  try {
    loading.value = true
    error.value = null

    if (!isAuthenticated.value) {
      toast.error('Vous devez être connecté pour voir vos commandes')
      router.push('/')
      return
    }

    const currentToken = getToken()
    if (!currentToken) {
      toast.error('Session expirée, veuillez vous reconnecter')
      router.push('/')
      return
    }

    const response = await commandesService.getMesCommandes(
      currentToken, 
      page, 
      10, 
      filtreStatut.value
    )

    commandes.value = response.commandes || []
    pagination.value = response.pagination

  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des commandes'
    
    if (err.message.includes('401') || err.message.includes('403')) {
      toast.error('Session expirée, veuillez vous reconnecter')
      router.push('/')
    }
  } finally {
    loading.value = false
  }
}

const toggleDetails = (commandeId) => {
  commandesDetails[commandeId] = !commandesDetails[commandeId]
}

const changerPage = (nouvellePage) => {
  if (nouvellePage >= 1 && pagination.value && nouvellePage <= pagination.value.pages) {
    chargerCommandes(nouvellePage)
  }
}

const peutAnnuler = (commande) => {
  if (['En préparation', 'Prête', 'En livraison', 'Livrée', 'Annulée'].includes(commande.statut)) {
    return { possible: false, raison: 'Commande déjà en cours ou terminée' }
  }
  
  const maintenant = new Date()
  const dateCommande = new Date(commande.created_at)
  const minutesEcoulees = (maintenant - dateCommande) / (1000 * 60)
  
  if (minutesEcoulees > 30) {
    return { possible: false, raison: 'Délai d\'annulation dépassé (30 min max)' }
  }
  
  return { possible: true, raison: null }
}

const getConditionsRemboursement = (commande) => {
  const delai = peutAnnuler(commande)
  
  if (!delai.possible) {
    return {
      remboursement: 0,
      message: delai.raison
    }
  }
  
  const maintenant = new Date()
  const dateCommande = new Date(commande.created_at)
  const minutesEcoulees = (maintenant - dateCommande) / (1000 * 60)
  
  if (minutesEcoulees <= 15) {
    return {
      remboursement: 100,
      message: 'Remboursement intégral (moins de 15 min)'
    }
  } else if (minutesEcoulees <= 30) {
    return {
      remboursement: 50,
      message: 'Remboursement partiel 50% (frais de traitement)'
    }
  }
  
  return {
    remboursement: 0,
    message: 'Aucun remboursement possible'
  }
}

const annulerCommande = async (commande) => {
  const conditions = getConditionsRemboursement(commande)
  
  if (conditions.remboursement === 0) {
    toast.error(conditions.message)
    return
  }
  
  const confirmation = confirm(`
🚫 Annulation de commande

📦 Commande : ${commande.numero_commande}
💰 Montant : ${parseFloat(commande.total).toFixed(2)}€
🔄 Remboursement : ${conditions.remboursement}% (${(parseFloat(commande.total) * conditions.remboursement / 100).toFixed(2)}€)

📋 Conditions :
${conditions.message}

⚖️ Conformément à l'article L221-28 du Code de la consommation

Confirmer l'annulation ?
  `)
  
  if (!confirmation) return
  
  try {
    annulationLoading.value = true
    
    const currentToken = getToken()
    if (!currentToken) {
      toast.error('Session expirée')
      return
    }

    await commandesService.annulerCommande(commande.id, currentToken, {
      pourcentage_remboursement: conditions.remboursement,
      raison: conditions.message
    })
    
    toast.success(`
✅ Commande annulée
💰 Remboursement de ${(parseFloat(commande.total) * conditions.remboursement / 100).toFixed(2)}€ 
⏱️ Délai : 3-5 jours ouvrés
    `)
    
    await chargerCommandes(pagination.value?.page || 1)
    
  } catch (err) {
    toast.error(err.message || 'Erreur lors de l\'annulation')
  } finally {
    annulationLoading.value = false
  }
}

onMounted(() => {
  chargerCommandes()
})
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}
</style>
