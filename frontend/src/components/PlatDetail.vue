<template>
  <div v-if="loading" class="text-center py-8">Chargement...</div>
  <div v-else-if="error" class="text-red-600 text-center py-8">{{ error }}</div>
  <div v-else class="p-6 min-h-screen">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img
          :src="plat.image"
          :alt="plat.nom"
          class="rounded-lg shadow-lg w-full max-h-96 object-cover"
        />
      </div>

      <div class="space-y-4">
        <h1 class="text-3xl font-semibold text-primary">{{ plat.nom }}</h1>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="flex items-center text-yellow-400">
              <template v-for="n in Math.floor(plat.note)">
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
          >
            -
          </button>
          <span class="text-lg font-semibold">{{ quantity }}</span>
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            @click="incrementQuantity"
          >
            +
          </button>
          <button
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center gap-2"
            @click="ajouterAuPanier"
          >
            <Icon icon="mdi:cart-plus" class="text-xl" />
            Ajouter au panier
          </button>
          <button
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

   <AvisCommentaires />

    <div class="mt-12">
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
          />

          <div class="flex-1 space-y-2">
            <h3 class="text-lg font-semibold text-primary">{{ similarPlat.nom }}</h3>
            <div class="flex items-center gap-2">
              <span class="flex items-center text-yellow-400">
                <template v-for="n in Math.floor(similarPlat.note)">
                  <Icon icon="mdi:star" class="text-sm" />
                </template>
                <template v-if="similarPlat.note % 1 !== 0">
                  <Icon icon="mdi:star-half-full" class="text-sm" />
                </template>
              </span>
              <span class="text-sm text-gray-700 font-semibold">{{ Number(similarPlat.note).toFixed(1) }}</span>            </div>
            <p class="text-lg font-semibold text-primary">{{ similarPlat.prix }} €</p>
            <button
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center gap-2"
              @click="ajouterAuPanier(similarPlat)"
            >
              <Icon icon="mdi:cart-plus" class="text-sm" />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { platsService } from '@/services/platsService.js'
  import { Icon } from '@iconify/vue'
  import AvisCommentaires from './AvisCommentaires.vue'
  import { favorisService } from '@/services/favorisService.js'
  import { useAuth } from '@/composables/useAuth'
  import { useToast } from 'vue-toastification'

  const route = useRoute()
  const plat = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const quantity = ref(1)
  const isFavori = ref(false)
  const plats = ref([])
  const favoris = ref([])
  const authData = useAuth()
  const toast = useToast()

  const getToken = () => {
    return authData?.token?.value || localStorage.getItem('auth_token')
  }

  const isUserAuthenticated = () => {
    return authData?.isAuthenticated?.value || !!getToken()
  }

  const isFavoris = computed(() => {
    return favoris.value.some(f => f.plat_id === plat.value?.id)
  })

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
      const allPlats = await platsService.getAll()
      plats.value = allPlats
      plat.value = await platsService.getById(route.params.id)
    } catch (e) {
      error.value = e.message || 'Error loading dish'
    } finally {
      loading.value = false
    }

    if (isUserAuthenticated()) {
      await chargerFavoris()
    }
  })

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const ajouterAuPanier = (platToAdd = plat.value) => {
  alert(`Ajouté "${platToAdd.nom}" au panier.`)
}

const toggleFavori = () => {
  isFavori.value = !isFavori.value
}

  const similarPlats = computed(() => {
    if (!plat.value || !plats.value.length) return []
    return plats.value
        .filter(p => p.type === plat.value.type && p.id !== plat.value.id)
        .slice(0, 3)
  })
</script>

<style scoped>
</style>