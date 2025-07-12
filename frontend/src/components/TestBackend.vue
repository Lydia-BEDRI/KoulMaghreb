<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Test de Connexion Backend
        </h1>
        <p class="text-lg text-gray-600">
          Cette page démontre la liaison entre le frontend Vue.js et le backend Node.js/MySQL
        </p>
      </div>

      <!-- Status de connexion -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">État du Backend</h2>
        
        <div v-if="loading" class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p class="mt-2 text-gray-600">Connexion au backend...</p>
        </div>

        <div v-else-if="backendStatus" class="space-y-3">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-green-700 font-medium">Backend connecté ✓</span>
          </div>
          <p class="text-gray-600">
            <strong>Message:</strong> {{ backendStatus.message }}
          </p>
          <p class="text-gray-600">
            <strong>Total des plats en base:</strong> {{ backendStatus.totalPlats }}
          </p>
          <p class="text-gray-600">
            <strong>Dernière vérification:</strong> {{ formatDate(backendStatus.timestamp) }}
          </p>
        </div>

        <div v-else class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <span class="text-red-700 font-medium">Erreur de connexion ✗</span>
        </div>
      </div>

      <!-- Liste des plats -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Plats depuis la Base de Données</h2>
        
        <div v-if="platsLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p class="mt-2 text-gray-600">Chargement des plats...</p>
        </div>

        <div v-else-if="plats.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="plat in plats" 
            :key="plat.id"
            class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div class="aspect-w-16 aspect-h-9 bg-gray-200">
              <img 
                :src="plat.image" 
                :alt="plat.nom"
                class="w-full h-48 object-cover"
                @error="handleImageError"
              />
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ plat.nom }}</h3>
                <span class="text-lg font-bold text-orange-600">{{ plat.prix }}€</span>
              </div>
              
              <div class="flex items-center mb-2">
                <div class="flex text-yellow-400">
                  ⭐ {{ plat.note }}/5
                </div>
                <span class="mx-2 text-gray-300">•</span>
                <span class="text-sm text-gray-600">{{ plat.pays }}</span>
              </div>
              
              <p class="text-gray-600 text-sm mb-3 line-clamp-3">
                {{ plat.short_desc }}
              </p>
              
              <div class="flex justify-between items-center">
                <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {{ plat.type }}
                </span>
                <span class="text-xs text-gray-500">ID: {{ plat.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          Aucun plat trouvé dans la base de données
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'TestBackend',
  setup() {
    const loading = ref(true)
    const platsLoading = ref(true)
    const backendStatus = ref(null)
    const plats = ref([])
    const error = ref(null)

    const API_BASE_URL = 'http://localhost:3001/api'

    // Vérifier le statut du backend
    const checkBackendStatus = async () => {
      try {
        console.log('🔍 Vérification du statut du backend...')
        const response = await fetch(`${API_BASE_URL}/test/status`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('✅ Statut du backend:', data)
        backendStatus.value = data
      } catch (err) {
        console.error('❌ Erreur de connexion au backend:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    // Récupérer les plats
    const fetchPlats = async () => {
      try {
        console.log('🔍 Récupération des plats...')
        const response = await fetch(`${API_BASE_URL}/test/plats`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('✅ Plats récupérés:', data)
        
        if (data.success) {
          plats.value = data.plats
        }
      } catch (err) {
        console.error('❌ Erreur lors de la récupération des plats:', err)
        error.value = err.message
      } finally {
        platsLoading.value = false
      }
    }

    // Formater la date
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('fr-FR')
    }

    // Gérer les erreurs d'images
    const handleImageError = (event) => {
      event.target.src = '/logo.png' // Image de fallback
    }

    // Charger les données au montage du composant
    onMounted(async () => {
      await checkBackendStatus()
      await fetchPlats()
    })

    return {
      loading,
      platsLoading,
      backendStatus,
      plats,
      error,
      formatDate,
      handleImageError
    }
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
