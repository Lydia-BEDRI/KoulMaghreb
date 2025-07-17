<template>
  <div class="p-6 bg-background min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-primary">Validez votre panier et passez votre commande</h1>
      <button 
        v-if="!isEmpty && !loading"
        @click="viderPanier" 
        class="flex items-center gap-2 py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
      >
        <TrashIcon class="w-5 h-5" />
        Vider le panier
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-600">Chargement du panier...</p>
    </div>

    <div v-else-if="isEmpty" class="bg-white p-6 rounded-2xl shadow border border-gray-200 text-center">
      <p class="text-gray-500 mb-4">Votre panier est vide</p>
      <router-link 
        to="/nos-plats" 
        class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition"
      >
        Découvrir nos plats
      </router-link>
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
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ item.type === 'plat' ? 'Plat' : 'Événement' }}
                </span>
              </div>
              <p class="text-sm text-gray-600">
                {{ parseFloat(item.prix_unitaire).toFixed(2) }}€ x {{ item.quantite }} = 
                <span class="font-bold">{{ parseFloat(item.sous_total).toFixed(2) }}€</span>
              </p>
              <div v-if="item.type === 'reservation'" class="text-xs text-gray-500 mt-1">
                <span v-if="getItemDetails(item).date">
                  📅 {{ formatDate(getItemDetails(item).date) }}
                </span>
                <span v-if="getItemDetails(item).lieu" class="ml-2">
                  📍 {{ getItemDetails(item).lieu }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="modifierQuantite(item.id, item.quantite - 1)" 
              :disabled="item.quantite <= 1"
              class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              -
            </button>
            <span class="text-lg font-semibold">{{ item.quantite }}</span>
            <button 
              @click="modifierQuantite(item.id, item.quantite + 1)" 
              class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition"
            >
              +
            </button>
            <button @click="supprimerItem(item.id)" class="ml-4">
              <TrashIcon class="w-6 h-6 text-red-500 hover:text-red-700 transition" />
            </button>
          </div>
        </div>
      </section>

      <section class="bg-neutral p-6 rounded-2xl shadow border-2 border-primary hover:shadow-lg hover:-translate-y-1 transition">
        <h2 class="text-xl font-medium mb-4">Résumé du paiement</h2>
        <div class="mb-2 flex justify-between">
          <span>Sous-total</span>
          <span>{{ totalPrix.toFixed(2) }}€</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span>Taxe</span>
          <span>{{ tax.toFixed(2) }}€</span>
        </div>
        <hr class="my-4 border-primary h-2" />
        <div class="mb-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{{ totalAvecTaxe.toFixed(2) }}€</span>
        </div>
        
        <button 
          @click="confirmerCommande"
          :disabled="commandeLoading || isEmpty"
          class="w-full py-2 bg-accent text-white rounded-xl hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <div v-if="commandeLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>{{ commandeLoading ? 'Traitement en cours...' : 'Passer la commande' }}</span>
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline'
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

    const confirmation = confirm(`
🛒 Confirmation de commande

📋 Récapitulatif :
• Articles : ${totalItems.value}
• Sous-total : ${totalPrix.value.toFixed(2)}€
• Taxe : ${tax.value.toFixed(2)}€
• Total : ${totalAvecTaxe.value.toFixed(2)}€

Êtes-vous sûr de vouloir passer cette commande ?
    `)

    if (!confirmation) {
      return
    }

    commandeLoading.value = true

    const response = await passerCommande()

    const numeroCommande = response.commande?.numero_commande || 'N/A'
    
    toast.success(`
🎉 Commande passée avec succès !

📦 Numéro : ${numeroCommande}
💰 Total : ${totalAvecTaxe.value.toFixed(2)}€

Vous allez être redirigé vers vos commandes...
    `, {
      timeout: 5000
    })

    setTimeout(() => {
      router.push('/mes-commandes')
    }, 2000)

  } catch (error) {
    if (error.message.includes('connecté')) {
      toast.error('Session expirée, veuillez vous reconnecter')
      router.push('/')
    } else if (error.message.includes('vide')) {
      toast.error('🛒Votre panier est vide')
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
