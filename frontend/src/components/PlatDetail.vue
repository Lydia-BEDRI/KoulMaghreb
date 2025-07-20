<template>
  <div v-if="loading" class="text-center py-8">Chargement...</div>
  <div v-else-if="error" class="text-red-600 text-center py-8">{{ error }}</div>
  <div v-else-if="plat" class="p-6 min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img
          :src="plat.image"
          :alt="plat.nom"
          class="rounded-lg shadow-lg w-full max-h-96 object-cover"
          @error="handleImageError"
        />
      </div>

      <div class="space-y-4">
        <h1 class="text-3xl font-semibold text-primary">{{ plat.nom }}</h1>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="flex items-center text-yellow-400">
              <template v-for="n in Math.floor(plat.note)" :key="n">
                <Icon icon="mdi:star" class="text-xl" />
              </template>
              <template v-if="plat.note % 1 !== 0">
                <Icon icon="mdi:star-half-full" class="text-xl" />
              </template>
            </span>
            <span class="text-lg text-gray-700 font-semibold">{{ Number(plat.note).toFixed(1) }}</span>
          </div>
        </div>
        <p class="text-2xl font-semibold text-accent">{{ plat.prix }} €</p>

        <p class="text-gray-600">{{ plat.short_desc }}</p>

        <div class="flex items-center gap-4">
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            @click="decrementQuantity"
            :disabled="ajoutLoading"
          >
            -
          </button>
          <span class="text-lg font-semibold">{{ quantity }}</span>
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            @click="incrementQuantity"
            :disabled="ajoutLoading"
          >
            +
          </button>
          <button
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center gap-2 disabled:opacity-50"
            @click="ajouterAuPanier"
            :disabled="ajoutLoading"
          >
            <Icon icon="mdi:cart-plus" class="text-xl" />
            {{ ajoutLoading ? 'Ajout...' : 'Ajouter au panier' }}
          </button>
          <button
            v-if="isUserAuthenticated()"
            @click="toggleFavoris(plat.id)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border transition"
            :class="isFavoris ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600'"
          >
            <Icon
              :icon="isFavoris ? 'mdi:heart' : 'mdi:heart-outline'"
              :class="isFavoris ? 'text-red-500' : 'text-gray-400'"
              class="text-xl"
            />
          </button>
        </div>

        <div class="space-y-1">
          <p class="text-gray-700"><strong>Pays :</strong> {{ plat.pays }}</p>
          <p class="text-gray-700"><strong>Type :</strong> {{ plat.type }}</p>
        </div>
      </div>
    </div>

    <div class="mt-8 mb-12">
      <h2 class="text-xl font-semibold text-primary mb-4">Description</h2>
      <p class="text-gray-600">{{ plat.long_desc }}</p>
    </div>

    <AvisCommentaires v-if="plat.id" :plat-id="plat.id" />

    <div v-if="similarPlats.length > 0" class="mt-12">
      <h2 class="text-xl font-semibold text-primary mb-4">Plats similaires</h2>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="similarPlat in similarPlats"
          :key="similarPlat.id"
          class="flex items-center bg-white rounded-xl shadow-lg p-4 gap-4 max-w-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
        >
          <img
            :src="similarPlat.image"
            :alt="similarPlat.nom"
            class="rounded-lg w-32 h-32 object-cover"
            @error="handleImageError"
          />

          <div class="flex-1 space-y-2">
            <h3 
              class="text-lg font-semibold text-primary cursor-pointer hover:text-accent transition"
              @click="router.push(`/plat/${similarPlat.id}`)"
            >
              {{ similarPlat.nom }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="flex items-center text-yellow-400">
                <template v-for="n in Math.floor(similarPlat.note)" :key="n">
                  <Icon icon="mdi:star" class="text-sm" />
                </template>
                <template v-if="similarPlat.note % 1 !== 0">
                  <Icon icon="mdi:star-half-full" class="text-sm" />
                </template>
              </span>
              <span class="text-sm text-gray-700 font-semibold">{{ Number(similarPlat.note).toFixed(1) }}</span>
            </div>
            <p class="text-lg font-semibold text-primary">{{ similarPlat.prix }} €</p>
            <button
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center gap-2 disabled:opacity-50"
              @click="ajouterAuPanier(similarPlat)"
              :disabled="ajoutLoading"
            >
              <Icon icon="mdi:cart-plus" class="text-sm" />
              {{ ajoutLoading ? 'Ajout...' : 'Ajouter' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { platsService } from '@/services/platsService.js'
import { favorisService } from '@/services/favorisService.js'
import { usePanier } from '@/composables/usePanier'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import AvisCommentaires from './AvisCommentaires.vue'
import { useSeo } from '@/composables/useSeo.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authData = useAuth()

const plat = ref(null)
const loading = ref(true)
const error = ref(null)
const quantity = ref(1)
const plats = ref([])
const favoris = ref([])
const ajoutLoading = ref(false)

const { ajouterAuPanier: ajouterAuPanierService } = usePanier()

const getToken = () => {
  return authData?.token?.value || localStorage.getItem('auth_token')
}

const isUserAuthenticated = () => {
  return authData?.isAuthenticated?.value || !!getToken()
}

const isFavoris = computed(() => {
  return favoris.value.some(f => f.plat_id === plat.value?.id)
})

const similarPlats = computed(() => {
  if (!plat.value || !plats.value.length) return []
  return plats.value
    .filter(p => p.type === plat.value.type && p.id !== plat.value.id)
    .slice(0, 3)
})

const handleImageError = (event) => {
  event.target.src = '/src/assets/img/placeholder.jpg'
}

const incrementQuantity = () => {
  if (!ajoutLoading.value) quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1 && !ajoutLoading.value) quantity.value--
}

const ajouterAuPanier = async (platToAdd = null) => {
  try {
    ajoutLoading.value = true
    
    let platAUtiliser = null;
    
    if (platToAdd && typeof platToAdd === 'object' && platToAdd.id) {
      platAUtiliser = platToAdd;
    }
    else if (plat.value && plat.value.id) {
      platAUtiliser = plat.value;
    }
    else {
      const platId = route.params.id;
      if (platId) {
        platAUtiliser = { id: parseInt(platId) };
      }
    }
        
    if (!platAUtiliser || !platAUtiliser.id) {
      console.error('Impossible de déterminer le plat à ajouter');
      toast.error('Erreur: impossible de déterminer le plat à ajouter');
      return;
    }
    
    await ajouterAuPanierService({
      type: 'plat',
      plat_id: parseInt(platAUtiliser.id),
      quantite: platAUtiliser === plat.value ? quantity.value : 1
    });
    
    toast.success(`${platAUtiliser.nom || 'Plat'} ajouté au panier !`);
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    toast.error('Erreur lors de l\'ajout au panier');
  } finally {
    ajoutLoading.value = false;
  }
}

const chargerFavoris = async () => {
  try {
    const token = getToken()
    if (!token) return
    
    const mesFavoris = await favorisService.getMesFavoris(token)
    favoris.value = mesFavoris || []
  } catch (e) {
    console.error('Erreur lors du chargement des favoris:', e)
  }
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

    const isFavorisActuel = favoris.value.some(f => f.plat_id === id)
    
    if (isFavorisActuel) {
      await favorisService.supprimerFavori(id, token)
      favoris.value = favoris.value.filter(f => f.plat_id !== id)
      toast.success('Plat supprimé de vos favoris')
    } else {
      await favorisService.ajouterFavori(id, token)
      if (plat.value) {
        favoris.value.push({ plat_id: id, ...plat.value })
      }
      toast.success('Plat ajouté à vos favoris')
    }
  } catch (e) {
    toast.error(e.message || 'Erreur lors de la gestion des favoris')
  }
}

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
  
    const platData = await platsService.getById(route.params.id)
    
    plat.value = platData
    
    const allPlats = await platsService.getAll()
    plats.value = allPlats
    
    if (isUserAuthenticated()) {
      await chargerFavoris()
    }
    
  } catch (e) {
    console.error('Erreur lors du chargement:', e)
    error.value = e.message || 'Erreur lors du chargement du plat'
  } finally {
    loading.value = false
  }
})

useSeo({
  title: plat.value ? `${plat.value.nom} - Plat maghrébin - KoulMaghreb` : 'Détail du plat - KoulMaghreb',
  description: plat.value ? plat.value.short_desc || plat.value.nom : "Découvrez les ingrédients, la recette et l'histoire de ce plat maghrébin sur KoulMaghreb."
})
</script>

<style scoped>
</style>