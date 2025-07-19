<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 class="text-xl font-semibold text-accent">Gestion des utilisateurs</h2>
                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {{ pagination?.total || 0 }} utilisateur{{ (pagination?.total || 0) > 1 ? 's' : '' }}
                </span>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div class="flex gap-3">
                    <select 
                        v-model="filtreStatut" 
                        @change="chargerUtilisateurs(1)"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                        <option value="Suspendu">Suspendu</option>
                    </select>
                    <input 
                        v-model="recherche"
                        @input="rechercherUtilisateurs"
                        placeholder="Rechercher..." 
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    />
                </div>
                
                <button 
                    @click="chargerUtilisateurs(pagination?.page || 1)"
                    :disabled="loading"
                    class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition text-sm disabled:opacity-50"
                >
                    <Icon icon="mdi:refresh" :class="{ 'animate-spin': loading }" />
                    Actualiser
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <!-- Loading state -->
            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p class="text-gray-600">Chargement des utilisateurs...</p>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="text-center py-12 text-red-600">
                <Icon icon="mdi:alert-circle" class="text-4xl mb-2" />
                <p class="mb-4">{{ error }}</p>
                <button 
                    @click="chargerUtilisateurs(1)" 
                    class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
                >
                    Réessayer
                </button>
            </div>

            <!-- Table -->
            <table v-else-if="utilisateurs.length > 0" class="w-full text-left text-sm border-separate border-spacing-y-2">
                <thead class="text-primary uppercase text-xs tracking-wide">
                    <tr>
                        <th class="py-2 px-3">ID</th>
                        <th class="py-2 px-3">Utilisateur</th>
                        <th class="py-2 px-3">Contact</th>
                        <th class="py-2 px-3">Statut</th>
                        <th class="py-2 px-3">Inscription</th>
                        <th class="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="utilisateur in utilisateurs" 
                        :key="utilisateur.id"
                        class="bg-background hover:bg-orange-50 rounded transition-colors"
                    >
                        <td class="py-3 px-3 font-semibold text-gray-800">
                            {{ utilisateur.id }}
                        </td>

                        <td class="py-3 px-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                                    {{ getInitiales(utilisateur.prenom, utilisateur.nom) }}
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">{{ utilisateur.prenom }} {{ utilisateur.nom }}</p>
                                    <p class="text-xs text-gray-500">{{ utilisateur.role }}</p>
                                </div>
                            </div>
                        </td>

                        <td class="py-3 px-3">
                            <div>
                                <p class="text-gray-800">{{ utilisateur.email }}</p>
                                <p class="text-xs text-gray-500">{{ utilisateur.telephone || 'Téléphone non renseigné' }}</p>
                            </div>
                        </td>

                        <td class="py-3 px-3">
                            <span 
                                :class="getStatutClass(utilisateur.statut)"
                                class="px-2 py-1 rounded-full text-xs font-semibold"
                            >
                                {{ utilisateur.statut }}
                            </span>
                        </td>

                        <td class="py-3 px-3 text-gray-600">
                            {{ formatDate(utilisateur.date_inscription || utilisateur.created_at) }}
                        </td>

                        <td class="py-3 px-3">
                            <div class="flex gap-2">
                                <button 
                                    @click="voirDetails(utilisateur)"
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

            <div v-else class="text-center py-8">
                <Icon icon="mdi:account-group" class="text-6xl text-gray-300 mb-4" />
                <p class="text-gray-500 text-lg">
                    {{ recherche || filtreStatut ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible' }}
                </p>
                <p class="text-sm text-gray-400 mt-2">
                    {{ recherche || filtreStatut ? 'Essayez de modifier vos filtres' : 'Les utilisateurs apparaîtront ici' }}
                </p>
            </div>
        </div>

        <div v-if="pagination && pagination.pages > 1" class="flex justify-center items-center gap-2">
            <button
                @click="chargerUtilisateurs(pagination.page - 1)"
                :disabled="pagination.page <= 1 || loading"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
                Précédent
            </button>
            
            <span class="px-4 py-2 text-gray-700">
                Page {{ pagination.page }} sur {{ pagination.pages }}
            </span>
            
            <button
                @click="chargerUtilisateurs(pagination.page + 1)"
                :disabled="pagination.page >= pagination.pages || loading"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
                Suivant
            </button>
        </div>

        <UtilisateurDetailModal 
            :show="showModal" 
            :utilisateur="selectedUtilisateur" 
            @close="fermerModal"
            @update="updateUtilisateur" 
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import { adminUtilisateursService } from '@/services/adminUtilisateursService'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import UtilisateurDetailModal from './UtilisateurDetailModal.vue'

const { isAdmin } = useAuth()
const toast = useToast()

// États
const utilisateurs = ref([])
const pagination = ref(null)
const loading = ref(false)
const error = ref(null)
const filtreStatut = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedUtilisateur = ref(null)

let rechercheTimeout = null

const token = computed(() => localStorage.getItem('auth_token'))

const chargerUtilisateurs = async (page = 1) => {
  if (!token.value || !isAdmin.value) {
    error.value = 'Accès non autorisé'
    return
  }

  try {
    loading.value = true
    error.value = null

    const response = await adminUtilisateursService.getAllUtilisateurs(
      token.value,
      page,
      20,
      recherche.value,
      filtreStatut.value
    )

    utilisateurs.value = response.users || []
    pagination.value = response.pagination

    if (utilisateurs.value.length === 0 && page > 1) {
      await chargerUtilisateurs(1)
    }

  } catch (err) {
    console.error('Erreur chargement utilisateurs:', err)
    error.value = err.message || 'Erreur lors du chargement des utilisateurs'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const rechercherUtilisateurs = () => {
  clearTimeout(rechercheTimeout)
  rechercheTimeout = setTimeout(() => {
    chargerUtilisateurs(1)
  }, 500)
}

const getStatutClass = (statut) => {
    const classes = {
        'Actif': 'bg-green-100 text-green-600',
        'Inactif': 'bg-yellow-100 text-yellow-600',
        'Suspendu': 'bg-red-100 text-red-600'
    }
    return classes[statut] || 'bg-gray-100 text-gray-600'
}

const getInitiales = (prenom, nom) => {
    return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase()
}

const formatDate = (date) => {
    if (!date) return 'Non disponible'
    try {
        return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
    } catch (err) {
        return 'Date invalide'
    }
}

const voirDetails = (utilisateur) => {
    selectedUtilisateur.value = utilisateur
    showModal.value = true
}

const fermerModal = () => {
    showModal.value = false
    selectedUtilisateur.value = null
}

const updateUtilisateur = async (updates) => {
    try {
        await adminUtilisateursService.updateUtilisateur(
            token.value,
            updates.id,
            {
                statut: updates.statut,
                role: updates.role
            }
        )

        toast.success('Utilisateur mis à jour avec succès !')
        
        await chargerUtilisateurs(pagination.value?.page || 1)
        
        fermerModal()

    } catch (err) {
        console.error('Erreur mise à jour utilisateur:', err)
        toast.error(err.message || 'Erreur lors de la mise à jour')
    }
}

onMounted(() => {
    chargerUtilisateurs(1)
})
</script>