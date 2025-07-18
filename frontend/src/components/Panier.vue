<template>
  <div class="p-6 bg-background min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-primary">Validez votre panier et passez votre commande</h1>
      <button 
        v-if="!isEmpty && !loading"
        @click="viderPanier" 
        class="flex items-center gap-2 py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
      >
        <Icon icon="mdi:trash-can" class="w-5 h-5" />
        Vider le panier
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-600">Chargement du panier...</p>
    </div>

    <div v-else-if="isEmpty" class="bg-white p-6 rounded-2xl shadow border border-gray-200 text-center">
      <Icon icon="mdi:cart-outline" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Votre panier est vide</h3>
      <p class="text-gray-500 mb-6">Découvrez nos délicieux plats et nos événements exclusifs</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/nos-plats" 
          class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition inline-flex items-center justify-center gap-2 font-medium"
        >
          <Icon icon="mdi:silverware-fork-knife" class="w-5 h-5" />
          Découvrir nos plats
        </router-link>
        
        <router-link 
          to="/evenements" 
          class="bg-accent text-white px-6 py-3 rounded-lg hover:bg-primary transition inline-flex items-center justify-center gap-2 font-medium"
        >
          <Icon icon="mdi:calendar-star" class="w-5 h-5" />
          Voir nos événements
        </router-link>
      </div>
      
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <Icon icon="mdi:silverware-fork-knife" class="w-5 h-5 text-green-600" />
            <h4 class="font-semibold text-green-800">Nos plats</h4>
          </div>
          <p class="text-sm text-green-700">
            Cuisine traditionnelle du Maghreb, plats authentiques préparés avec amour
          </p>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <Icon icon="mdi:calendar-star" class="w-5 h-5 text-blue-600" />
            <h4 class="font-semibold text-blue-800">Nos événements</h4>
          </div>
          <p class="text-sm text-blue-700">
            Soirées culturelles, festivals et célébrations de la culture maghrébine
          </p>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-6 rounded-2xl shadow border border-gray-200">
      <section class="mb-6">
        <h2 class="text-xl font-medium mb-3">Récapitulatif de commande</h2>
        <div
          v-for="item in panier"
          :key="item.id"
          class="bg-white p-4 rounded-2xl mb-4 flex justify-between items-center shadow hover:shadow-lg hover:-translate-y-1 transition border border-gray-200"
        >
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              <img :src="getItemImage(item)" :alt="getItemName(item)" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <p class="text-lg font-semibold text-primary">{{ getItemName(item) }}</p>
                <span 
                  :class="item.type === 'plat' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                  class="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                >
                  <Icon :icon="item.type === 'plat' ? 'mdi:silverware-fork-knife' : 'mdi:calendar-star'" class="w-3 h-3" />
                  {{ item.type === 'plat' ? 'Plat' : 'Événement' }}
                </span>
              </div>
              <p class="text-sm text-gray-600 flex items-center gap-1">
                <Icon icon="mdi:currency-eur" class="w-4 h-4" />
                {{ parseFloat(item.prix_unitaire).toFixed(2) }}€ x {{ item.quantite }} = 
                <span class="font-bold">{{ parseFloat(item.sous_total).toFixed(2) }}€</span>
              </p>
              <div v-if="item.type === 'reservation'" class="text-xs text-gray-500 mt-1">
                <div class="flex items-center gap-2">
                  <Icon icon="mdi:calendar-clock" class="w-4 h-4" />
                  <span v-if="getItemDetails(item).date">
                    {{ formatDate(getItemDetails(item).date) }}
                  </span>
                  <Icon icon="mdi:map-marker" class="w-4 h-4 ml-2" />
                  <span v-if="getItemDetails(item).lieu">
                    {{ getItemDetails(item).lieu }}
                  </span>
                </div>
                <div class="flex items-center gap-1 mt-1">
                  <Icon icon="mdi:account-group" class="w-4 h-4" />
                  <span>{{ item.quantite }} place{{ item.quantite > 1 ? 's' : '' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="modifierQuantite(item.id, item.quantite - 1)" 
              :disabled="item.quantite <= 1"
              class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              <Icon icon="mdi:minus" class="w-4 h-4" />
            </button>
            <span class="text-lg font-semibold px-3">{{ item.quantite }}</span>
            <button 
              @click="modifierQuantite(item.id, item.quantite + 1)" 
              class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition"
            >
              <Icon icon="mdi:plus" class="w-4 h-4" />
            </button>
            <button @click="supprimerItem(item.id)" class="ml-4 p-2 hover:bg-red-50 rounded-lg transition">
              <Icon icon="mdi:delete" class="w-5 h-5 text-red-500 hover:text-red-700" />
            </button>
          </div>
        </div>
      </section>

      <section class="bg-neutral p-6 rounded-2xl shadow border-2 border-primary hover:shadow-lg hover:-translate-y-1 transition">
        <h2 class="text-xl font-medium mb-4 flex items-center gap-2">
          <Icon icon="mdi:calculator" class="w-5 h-5" />
          Résumé du paiement
        </h2>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="flex items-center gap-2">
              <Icon icon="mdi:receipt" class="w-4 h-4 text-gray-500" />
              Sous-total
            </span>
            <span>{{ totalPrix.toFixed(2) }}€</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="flex items-center gap-2">
              <Icon icon="mdi:percent" class="w-4 h-4 text-gray-500" />
              Taxe (5%)
            </span>
            <span>{{ tax.toFixed(2) }}€</span>
          </div>
          <hr class="my-4 border-primary" />
          <div class="flex justify-between items-center font-bold text-lg">
            <span class="flex items-center gap-2">
              <Icon icon="mdi:currency-eur" class="w-5 h-5 text-primary" />
              Total
            </span>
            <span class="text-primary">{{ totalAvecTaxe.toFixed(2) }}€</span>
          </div>
        </div>
        
        <button 
          @click="confirmerCommande"
          :disabled="commandeLoading || isEmpty"
          class="w-full py-3 mt-6 bg-accent text-white rounded-xl hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          <div v-if="commandeLoading" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <Icon v-else icon="mdi:credit-card-check" class="w-5 h-5" />
          <span>{{ commandeLoading ? 'Traitement en cours...' : 'Passer la commande' }}</span>
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePanier } from '@/composables/usePanier'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const toast = useToast()
const { isAuthenticated } = useAuth()

const { 
  panier, 
  loading, 
  totalItems, 
  totalPrix, 
  isEmpty,
  chargerPanier,
  modifierQuantite,
  supprimerItem,
  viderPanier,
  passerCommande
} = usePanier()

const commandeLoading = ref(false)

const getItemName = (item) => {
  const details = getItemDetails(item)
  return item.type === 'plat' ? details.nom : details.title
}

const getItemImage = (item) => {
  const details = getItemDetails(item)
  return details.image || '/default-image.jpg'
}

const getItemDetails = (item) => {
  try {
    return typeof item.item_details === 'string' 
      ? JSON.parse(item.item_details) 
      : item.item_details || {}
  } catch (e) {
    return {}
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

const tax = computed(() => totalPrix.value * 0.05)
const totalAvecTaxe = computed(() => totalPrix.value + tax.value)

const confirmerCommande = async () => {
  try {
    if (!isAuthenticated.value) {
      toast.error('Vous devez être connecté pour passer une commande')
      router.push('/')
      return
    }

    if (isEmpty.value) {
      toast.error('Votre panier est vide')
      return
    }

    const plats = panier.value.filter(item => item.type === 'plat')
    const reservations = panier.value.filter(item => item.type === 'reservation')
    
    const confirmation = confirm(`
Confirmation de commande

Récapitulatif :
${plats.length > 0 ? `• Plats : ${plats.length} article(s)` : ''}
${reservations.length > 0 ? `• Réservations : ${reservations.reduce((total, r) => total + parseInt(r.quantite), 0)} place(s)` : ''}
• Total : ${totalAvecTaxe.value.toFixed(2)}€

${plats.length > 0 ? 'Vos plats iront dans "Mes commandes"' : ''}
${reservations.length > 0 ? 'Vos réservations iront dans "Mes réservations"' : ''}

Êtes-vous sûr de vouloir valider ?
    `)

    if (!confirmation) return

    commandeLoading.value = true

    const response = await passerCommande()

    toast.success(response.message, { timeout: 5000 })

    if (response.commande && response.reservations.length > 0) {
      toast.info('Vérifiez "Mes commandes" et "Mes réservations"', { timeout: 3000 })
      setTimeout(() => router.push('/mes-commandes'), 2000)
    } else if (response.commande) {
      setTimeout(() => router.push('/mes-commandes'), 2000)
    } else if (response.reservations.length > 0) {
      setTimeout(() => router.push('/mes-reservations'), 2000)
    }

  } catch (error) {
    if (error.message.includes('connecté')) {
      toast.error('Session expirée, veuillez vous reconnecter')
      router.push('/')
    } else if (error.message.includes('vide')) {
      toast.error('Votre panier est vide')
    } else if (error.message.includes('détails')) {
      toast.error('Erreur avec les articles du panier. Veuillez réessayer.')
    } else if (error.message.includes('token') || error.message.includes('Token')) {
      toast.error('Session expirée, veuillez vous reconnecter')
      router.push('/')
    } else {
      toast.error(`${error.message || 'Erreur lors de la commande'}`)
    }
  } finally {
    commandeLoading.value = false
  }
}

onMounted(() => {
  chargerPanier()
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
