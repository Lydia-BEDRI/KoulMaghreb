<template>
  <div class="p-6 bg-background min-h-screen">
    <h1 class="text-2xl font-semibold mb-6 text-primary">Catalogue des Plats</h1>

    <div class="filters space-y-8 mb-8">
      <div>
        <h3 class="text-lg font-semibold mb-2">Type de plat</h3>
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="type in types"
            :key="type"
            :class="[
              'bg-white rounded-xl p-4 shadow transition flex items-center justify-center gap-3 cursor-pointer',
              selectedType === type ? 'border-2 border-primary' : 'border border-gray-200'
            ]"
            @click="selectedType = (selectedType === type ? '' : type)"
          >
            <Icon :icon="getTypeIcon(type)" class="text-3xl text-primary" />
            <span class="text-sm font-medium">{{ type }}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-2">Pays</h3>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="pays in paysList"
            :key="pays"
            :class="[
              'bg-white rounded-xl p-4 shadow transition flex items-center justify-center gap-3 cursor-pointer',
              selectedPays === pays ? 'border-2 border-accent' : 'border border-gray-200'
            ]"
            @click="selectedPays = (selectedPays === pays ? '' : pays)"
          >
            <Icon :icon="getPaysIcon(pays)" class="text-3xl text-accent" />
            <span class="text-sm font-medium">{{ pays }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="mdi:star-outline" class="text-2xl text-primary" /> Note minimale
          </label>
          <select
            v-model="selectedNote"
            class="w-full bg-white text-gray-700 rounded-lg p-2 shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="0">Toutes les notes</option>
            <option v-for="note in notes" :key="note" :value="note">
              {{ note }} ⭐
            </option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="mdi:sort-variant" class="text-2xl text-primary" /> Ordonner par
          </label>
          <select
            v-model="selectedOrder"
            class="w-full bg-white text-gray-700 rounded-xl p-2 shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="default">Par défaut</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="note_desc">Note décroissante</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" class="text-center py-8">Chargement...</div>
      <div v-else-if="error" class="text-red-600 text-center py-8">{{ error }}</div>
      <div v-else v-for="plat in filteredPlats" :key="plat.id"
        class="relative bg-white rounded-2xl shadow border border-gray-200 p-6 transition hover:shadow-lg">
        <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
          <img :src="plat.image" :alt="plat.nom" class="w-full h-full object-cover" />
          <div
            class="absolute top-2 right-2 z-10 cursor-pointer group"
            @click="toggleFavoris(plat.id)"
          >
            <div
              class="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition"
            >
              <Icon
                :icon="favoris.some(f => f.plat_id === plat.id) ? 'mdi:heart' : 'mdi:heart-outline'"
                :class="favoris.some(f => f.plat_id === plat.id) ? 'text-red-500' : 'text-gray-400'"
                class="text-xl group-hover:scale-110 transform transition-transform duration-200"
              />
            </div>
          </div>
        </div>
        <h2 class="text-lg font-semibold text-primary mb-2">{{ plat.nom }}</h2>
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm text-gray-600">{{ plat.prix }} €</p>
          <div class="flex items-center gap-1">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
            <span class="text-lg text-gray-700 font-semibold">{{ Number(plat.note).toFixed(1) }}</span>          </div>
        </div>
        <div class="flex justify-between items-center gap-2">
          <button 
            class="bg-accent text-white px-4 py-2 rounded-xl hover:bg-primary transition flex-1"
            @click="voirDetails(plat.id)"
          >
            Détails
          </button>
          <button 
            @click="ajouterAuPanierPlat(plat)"
            :disabled="isPlatLoading(plat.id)"
            class="bg-primary text-white px-4 py-2 rounded-xl hover:bg-accent transition flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isPlatLoading(plat.id) ? 'Ajout...' : 'Commander' }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="fixed bottom-4 right-4 bg-primary text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center cursor-pointer transition transform hover:scale-110 hover:shadow-2xl"
      @click="redirectToPanier"
    >
      <div class="relative">
        <ShoppingCartIcon class="w-8 h-8 text-white" />
        <span
          v-if="totalItems > 0"
          class="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
        >
          {{ totalItems }}
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { platsService } from '@/services/platsService.js'
import { favorisService } from '@/services/favorisService.js'
import { useAuth } from '@/composables/useAuth'
import { usePanier } from '@/composables/usePanier'
import { useToast } from 'vue-toastification'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { Icon } from '@iconify/vue'
import { useModalStore } from '@/stores/useModalStore'

const router = useRouter()
const toast = useToast()
const modal = useModalStore()

const types = ['Entrée', 'Plat principal', 'Dessert', 'Accompagnement']
const paysList = ['Maroc', 'Algérie', 'Tunisie']
const notes = [5, 4, 3, 2, 1]

const selectedType = ref('')
const selectedPays = ref('')
const selectedNote = ref(0)
const selectedOrder = ref('default')

const plats = ref([])
const loading = ref(true)
const error = ref(null)
const favoris = ref([])

const platsLoading = ref(new Set()) 

const { 
  panier, 
  totalItems, 
  totalPrix, 
  ajouterAuPanier, 
  chargerPanier,
  peutAccederAuPanier
} = usePanier()

const authData = useAuth()

const getToken = () => {
  return authData?.token?.value || localStorage.getItem('auth_token')
}

const isUserAuthenticated = () => {
  return authData?.isAuthenticated?.value || !!getToken()
}

onMounted(async () => {
  try {
    console.log('Chargement des plats...')
    plats.value = await platsService.getAll()
    console.log('Plats chargés:', plats.value.length)
    
    if (isUserAuthenticated()) {
      try {
        await chargerFavoris()
      } catch (favorisError) {
        console.error('Erreur favoris (non bloquante):', favorisError)
      }
    }
    
    await chargerPanier()
    
  } catch (e) {
    console.error('Erreur détaillée:', e)
    error.value = 'Erreur lors du chargement des plats'
  } finally {
    loading.value = false
  }
})

const chargerFavoris = async () => {
  try {
    const token = getToken()
    if (!token) {
      console.log('Pas de token, favoris non chargés')
      return
    }
    
    console.log('Chargement des favoris...')
    const mesFavoris = await favorisService.getMesFavoris(token)
    favoris.value = mesFavoris || []
    console.log('Favoris chargés:', favoris.value)
  } catch (e) {
    console.error('Erreur lors du chargement des favoris:', e)
  }
}

const getTypeIcon = (type) => {
  const icons = {
    'Entrée': 'mdi:silverware-fork-knife',
    'Plat principal': 'mdi:food',
    'Dessert': 'mdi:cake',
    'Accompagnement': 'mdi:food-variant'
  }
  return icons[type] || 'mdi:food'
}

const getPaysIcon = (pays) => {
  const icons = {
    'Maroc': 'twemoji:flag-morocco',
    'Algérie': 'twemoji:flag-algeria',
    'Tunisie': 'twemoji:flag-tunisia'
  }
  return icons[pays] || 'mdi:flag'
}

const filteredPlats = computed(() => {
  let filtered = plats.value

  if (selectedType.value) {
    filtered = filtered.filter(plat => plat.type === selectedType.value)
  }

  if (selectedPays.value) {
    filtered = filtered.filter(plat => plat.pays === selectedPays.value)
  }

  if (selectedNote.value > 0) {
    filtered = filtered.filter(plat => Math.floor(plat.note) >= selectedNote.value)
  }

  if (selectedOrder.value === 'prix_asc') {
    filtered.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix))
  } else if (selectedOrder.value === 'prix_desc') {
    filtered.sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix))
  } else if (selectedOrder.value === 'note_desc') {
    filtered.sort((a, b) => parseFloat(b.note) - parseFloat(a.note))
  } else if (selectedOrder.value === 'nom_asc') {
    filtered.sort((a, b) => a.nom.localeCompare(b.nom))
  }

  return filtered
})

const ajouterAuPanierPlat = async (plat) => {
  try {
    platsLoading.value.add(plat.id)
    
    await ajouterAuPanier({
      type: 'plat',
      plat_id: plat.id,
      quantite: 1
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
  } finally {
    platsLoading.value.delete(plat.id)
  }
}

const isPlatLoading = (platId) => {
  return platsLoading.value.has(platId)
}

const toggleFavoris = async (id) => {
  if (!isUserAuthenticated()) {
    toast.error('Vous devez être connecté pour gérer vos favoris')
    return
  }

  try {
    const token = getToken()
    if (!token) {
      toast.error('Token d\'authentification manquant')
      return
    }

    const isFavoris = favoris.value.some(f => f.plat_id === id)
    
    if (isFavoris) {
      await favorisService.supprimerFavori(id, token)
      favoris.value = favoris.value.filter(f => f.plat_id !== id)
      toast.success('Plat supprimé de vos favoris')
    } else {
      await favorisService.ajouterFavori(id, token)
      const plat = plats.value.find(p => p.id === id)
      if (plat) {
        favoris.value.push({ plat_id: id, ...plat })
      }
      toast.success('Plat ajouté à vos favoris')
    }
  } catch (e) {
    toast.error(e.message || 'Erreur lors de la gestion des favoris')
  }
}

const voirDetails = (id) => {
  router.push(`/plat/${id}`)
}

const redirectToPanier = () => {
  if (peutAccederAuPanier()) {
    router.push('/mon-panier')
  } else {
    if (totalItems.value > 0) {
      toast.info(`Vous avez ${totalItems.value} article${totalItems.value > 1 ? 's' : ''} dans votre panier. Connectez-vous pour finaliser votre commande !`, {
        timeout: 4000
      })
      modal.openLogin()
    } else {
      toast.info('Votre panier est vide. Ajoutez des plats pour commencer !')
    }
  }
}
</script>

<style scoped>
.filters div {
  height: 80px;
}

.fixed {
  z-index: 50;
}
</style>
