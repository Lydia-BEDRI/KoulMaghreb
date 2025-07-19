<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 class="text-xl font-semibold text-accent">Gestion des avis</h2>
                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {{ totalAvis }} avis
                </span>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div class="flex gap-3">
                    <select 
                        v-model="filtreNote" 
                        @change="chargerAvis"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Toutes les notes</option>
                        <option value="5">5 étoiles</option>
                        <option value="4">4 étoiles</option>
                        <option value="3">3 étoiles</option>
                        <option value="2">2 étoiles</option>
                        <option value="1">1 étoile</option>
                    </select>
                    <select 
                        v-model="filtreStatut" 
                        @change="chargerAvis"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="true">Publié</option>
                        <option value="false">En attente</option>
                    </select>
                    <input 
                        v-model="recherche" 
                        @input="debounceSearch"
                        placeholder="Rechercher..." 
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-center py-8">
            <Icon icon="mdi:loading" class="text-4xl text-primary animate-spin mb-4" />
            <p class="text-gray-600">Chargement des avis...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-2 text-red-800">
                <Icon icon="mdi:alert-circle" class="text-xl" />
                <p>{{ error }}</p>
            </div>
        </div>

        <div v-else class="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table class="w-full text-left text-sm border-separate border-spacing-y-2">
                <thead class="text-primary uppercase text-xs tracking-wide">
                    <tr>
                        <th class="py-2 px-3">ID</th>
                        <th class="py-2 px-3">Client</th>
                        <th class="py-2 px-3">Note</th>
                        <th class="py-2 px-3">Commentaire</th>
                        <th class="py-2 px-3">Plat</th>
                        <th class="py-2 px-3">Statut</th>
                        <th class="py-2 px-3">Date</th>
                        <th class="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="avis in avisData" 
                        :key="avis.id"
                        class="bg-background hover:bg-orange-50 rounded transition-colors"
                    >
                        <td class="py-3 px-3 font-semibold text-gray-800">
                            {{ avis.id }}
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                                    {{ getInitiales(avis.utilisateur?.nom || 'Utilisateur') }}
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">{{ avis.utilisateur?.nom || 'Utilisateur' }}</p>
                                    <p class="text-xs text-gray-500">ID: {{ avis.user_id }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex flex-col items-center gap-1">
                                <div class="flex gap-0.5 text-yellow-400">
                                    <Icon v-for="i in avis.note" :key="i" icon="mdi:star" class="text-sm" />
                                    <Icon v-for="i in (5 - avis.note)" :key="i + avis.note" icon="mdi:star-outline" class="text-sm text-gray-300" />
                                </div>
                                <span class="text-sm font-medium text-gray-600 mt-1">{{ avis.note }}/5</span>
                            </div>
                        </td>
                        <td class="py-3 px-3 max-w-xs">
                            <p class="text-gray-800 truncate" :title="avis.commentaire">
                                {{ avis.commentaire || 'Aucun commentaire' }}
                            </p>
                        </td>
                        <td class="py-3 px-3">
                            <p class="font-medium text-gray-800">{{ avis.plat?.nom || 'Plat supprimé' }}</p>
                            <p class="text-xs text-gray-500">{{ avis.plat?.prix || 0 }}€</p>
                        </td>
                        <td class="py-3 px-3">
                            <span 
                                :class="getStatutClass(avis.approuve)"
                                class="px-2 py-1 rounded-full text-xs font-semibold"
                            >
                                {{ avis.approuve ? 'Publié' : 'En attente' }}
                            </span>
                        </td>
                        <td class="py-3 px-3 text-gray-600">
                            {{ formatDate(avis.created_at) }}
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex gap-2">
                                <button 
                                    @click="voirDetails(avis)"
                                    class="bg-primary text-white px-3 py-1 rounded-lg text-xs hover:bg-accent transition"
                                    title="Voir détails"
                                >
                                    Détails
                                </button>
                                <button 
                                    @click="supprimerAvis(avis)"
                                    class="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                                    title="Supprimer"
                                >
                                    <Icon icon="mdi:delete" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="avisData.length === 0" class="text-center py-8">
                <Icon icon="mdi:comment-text" class="text-6xl text-gray-300 mb-4" />
                <p class="text-gray-500 text-lg">
                    {{ recherche || filtreNote || filtreStatut ? 'Aucun avis trouvé' : 'Aucun avis disponible' }}
                </p>
                <p class="text-sm text-gray-400 mt-2">
                    {{ recherche || filtreNote || filtreStatut ? 'Essayez de modifier vos filtres' : 'Les avis clients apparaîtront ici' }}
                </p>
            </div>

            <div v-if="pagination && pagination.pages > 1" class="flex justify-center items-center gap-2 mt-6">
                <button 
                    @click="changerPage(pagination.page - 1)"
                    :disabled="pagination.page <= 1"
                    class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Précédent
                </button>
                
                <span class="text-sm text-gray-600">
                    Page {{ pagination.page }} sur {{ pagination.pages }}
                </span>
                
                <button 
                    @click="changerPage(pagination.page + 1)"
                    :disabled="pagination.page >= pagination.pages"
                    class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                    Suivant
                </button>
            </div>
        </div>

        <AvisDetailModal 
            :show="showModal"
            :avis="selectedAvis"
            @close="showModal = false"
            @update="updateAvis"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import AvisDetailModal from './AvisDetailModal.vue'
import { useToast } from 'vue-toastification'
import { avisService } from '@/services/avisService'

const toast = useToast()

const avisData = ref([])
const loading = ref(true)
const error = ref('')
const totalAvis = ref(0)
const pagination = ref(null)

const filtreNote = ref('')
const filtreStatut = ref('')
const recherche = ref('')
const searchTimeout = ref(null)

const showModal = ref(false)
const selectedAvis = ref(null)

const getToken = () => {
    return localStorage.getItem('auth_token')
}

const chargerAvis = async (page = 1) => {
    try {
        loading.value = true
        error.value = ''
        
        const currentToken = getToken()
        if (!currentToken) {
            throw new Error('Token d\'authentification manquant')
        }

        const filters = {}
        if (filtreNote.value) filters.note = filtreNote.value
        if (filtreStatut.value) filters.approuve = filtreStatut.value
        if (recherche.value) filters.search = recherche.value

        const response = await avisService.getAllAvis(currentToken, page, 10, filters)
        
        avisData.value = response.avis || []
        pagination.value = response.pagination
        totalAvis.value = response.pagination?.total || 0

    } catch (err) {
        console.error('Erreur chargement avis:', err)
        error.value = err.message || 'Erreur lors du chargement des avis'
        
        if (err.message.includes('401') || err.message.includes('403')) {
            toast.error('Session expirée, veuillez vous reconnecter')
        }
    } finally {
        loading.value = false
    }
}

const debounceSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    searchTimeout.value = setTimeout(() => {
        chargerAvis(1)
    }, 500)
}

const changerPage = (nouvellePage) => {
    if (nouvellePage >= 1 && pagination.value && nouvellePage <= pagination.value.pages) {
        chargerAvis(nouvellePage)
    }
}

const getStatutClass = (approuve) => {
    return approuve 
        ? 'bg-green-100 text-green-600'
        : 'bg-yellow-100 text-yellow-600'
}

const getInitiales = (nom) => {
    if (!nom) return '?'
    const parties = nom.trim().split(' ')
    return parties.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

const formatDate = (date) => {
    if (!date) return 'Non disponible'
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
}

const voirDetails = (avis) => {
    selectedAvis.value = {
        ...avis,
        client: {
            nom: avis.utilisateur?.nom || 'Utilisateur',
            email: avis.utilisateur?.email || `user_${avis.user_id}@example.com`,
            telephone: 'Non renseigné'
        },
        statut: avis.approuve ? 'Publié' : 'En attente'
    }
    showModal.value = true
}

const updateAvis = async (updates) => {
    try {
        const currentToken = getToken()
        if (!currentToken) {
            throw new Error('Token d\'authentification manquant')
        }

        const apiData = {
            approuve: updates.statut === 'Publié'
        }

        await avisService.updateAvis(updates.id, apiData, currentToken)
        
        toast.success('Avis mis à jour avec succès !')
        
        await chargerAvis(pagination.value?.page || 1)
        
    } catch (err) {
        console.error('Erreur mise à jour avis:', err)
        toast.error(err.message || 'Erreur lors de la mise à jour de l\'avis')
    }
}

const supprimerAvis = async (avis) => {
    const confirmation = confirm(
        `Êtes-vous sûr de vouloir supprimer l'avis de ${avis.utilisateur?.nom || 'cet utilisateur'} ?\n\nCette action est irréversible.`
    )
    
    if (!confirmation) return
    
    try {
        const currentToken = getToken()
        if (!currentToken) {
            throw new Error('Token d\'authentification manquant')
        }

        await avisService.deleteAvis(avis.id, currentToken)
        
        toast.success('Avis supprimé avec succès !')
        
        await chargerAvis(pagination.value?.page || 1)
        
    } catch (err) {
        console.error('Erreur suppression avis:', err)
        toast.error(err.message || 'Erreur lors de la suppression de l\'avis')
    }
}

onMounted(() => {
    chargerAvis(1)
})
</script>
