<template>
    <div class="p-6 min-h-screen bg-background">
        <h1 class="text-2xl font-semibold mb-6 text-primary">Mes Favoris</h1>

        <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="mt-2 text-gray-600">Chargement de vos favoris...</p>
        </div>

        <div v-else-if="error" class="text-center py-8 text-red-600">
            <p>{{ error }}</p>
            <button @click="chargerFavoris" class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent">
                Réessayer
            </button>
        </div>

        <div v-else-if="favoris.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="plat in favoris" :key="plat.id"
                class="relative bg-white rounded-2xl shadow border border-gray-200 p-6 transition hover:shadow-lg">


                <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                    <div class="absolute top-2 right-2 z-10 cursor-pointer group" @click="supprimerFavori(plat.plat_id)">
                        <div
                            class="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition">
                            <Icon icon="mdi:heart"
                                class="text-red-500 text-xl group-hover:scale-110 transform transition-transform duration-200" />
                        </div>
                    </div>

                    <img :src="plat.image" :alt="plat.nom" class="w-full h-full object-cover" />
                </div>
                <h2 class="text-lg font-semibold text-primary mb-2">{{ plat.nom }}</h2>
                <div class="flex justify-between items-center mb-4">
                    <p class="text-sm text-gray-600">{{ plat.prix }} €</p>
                    <div class="flex items-center gap-1">
                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                        <span class="text-sm text-gray-600 font-medium">{{ plat.note }}</span>
                    </div>
                </div>
                <div class="flex justify-between items-center gap-2">
                    <button class="bg-accent text-white px-4 py-2 rounded-xl hover:bg-primary transition flex-1"
                        @click="voirDetails(plat)">
                        Détails
                    </button>
                    <button class="bg-primary text-white px-4 py-2 rounded-xl hover:bg-accent transition flex-1"
                        @click="ajouterAuPanier(plat)">
                        Commander
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-gray-600">
            <p>Aucun plat dans vos favoris pour le moment.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { favorisService } from '@/services/favorisService'
import { useSeo } from '@/composables/useSeo.js'

const router = useRouter()
const toast = useToast()

const favoris = ref([])
const loading = ref(true)
const error = ref('')

const chargerFavoris = async () => {
    loading.value = true
    error.value = ''
    try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
            error.value = 'Vous devez être connecté pour voir vos favoris.'
            return
        }
        favoris.value = await favorisService.getMesFavoris(token)
    } catch (e) {
        error.value = e.message || 'Erreur lors du chargement des favoris'
    } finally {
        loading.value = false
    }
}

const supprimerFavori = async (platId) => {
    try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
            toast.error('Vous devez être connecté')
            return
        }
        await favorisService.supprimerFavori(platId, token)
        favoris.value = favoris.value.filter(f => f.plat_id !== platId)
        toast.success('Plat supprimé de vos favoris')
    } catch (e) {
        toast.error(e.message || 'Erreur lors de la suppression')
    }
}

const ajouterAuPanier = (plat) => {
    toast.success(`"${plat.nom}" ajouté au panier`)
}

const voirDetails = (plat) => {
    router.push({ name: 'Plat', params: { id: plat.plat_id } })
}

onMounted(chargerFavoris)

useSeo({
  title: 'Mes favoris - KoulMaghreb',
  description: "Retrouvez tous vos plats maghrébins préférés dans votre espace favoris et commandez-les en un clic sur KoulMaghreb."
})
</script>
