<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 class="text-xl font-semibold text-accent">Gestion des utilisateurs</h2>
                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {{ utilisateursFiltres.length }} utilisateur{{ utilisateursFiltres.length > 1 ? 's' : '' }}
                </span>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div class="flex gap-3">
                    <select v-model="filtreStatut"
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary">
                        <option value="">Tous les statuts</option>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                        <option value="Suspendu">Suspendu</option>
                    </select>
                    <input v-model="recherche" placeholder="Rechercher..."
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary" />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table class="w-full text-left text-sm border-separate border-spacing-y-2">
                <thead class="text-primary uppercase text-xs tracking-wide">
                    <tr>
                        <th class="py-2 px-3">ID</th>
                        <th class="py-2 px-3">Utilisateur</th>
                        <th class="py-2 px-3">Contact</th>
                        <th class="py-2 px-3">Statut</th>
                        <th class="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="utilisateur in utilisateursFiltres" :key="utilisateur.id"
                        class="bg-background hover:bg-orange-50 rounded transition-colors">
                        <td class="py-3 px-3 font-semibold text-gray-800">
                            {{ utilisateur.id }}
                        </td>

                        <td class="py-3 px-3">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                                    {{ getInitiales(utilisateur.prenom, utilisateur.nom) }}
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">{{ utilisateur.prenom }} {{ utilisateur.nom }}
                                    </p>
                                    <p class="text-xs text-gray-500">{{ utilisateur.role }}</p>
                                </div>
                            </div>
                        </td>

                        <td class="py-3 px-3">
                            <div>
                                <p class="text-gray-800">{{ utilisateur.email }}</p>
                                <p class="text-xs text-gray-500">{{ utilisateur.telephone }}</p>
                            </div>
                        </td>

                        <td class="py-3 px-3">
                            <span :class="getStatutClass(utilisateur.statut)"
                                class="px-2 py-1 rounded-full text-xs font-semibold">
                                {{ utilisateur.statut }}
                            </span>
                        </td>

                        <td class="py-3 px-3">
                            <div class="flex gap-2">
                                <button @click="voirDetails(utilisateur)"
                                    class="bg-primary text-white px-3 py-1 rounded-lg text-xs hover:bg-accent transition"
                                    title="Voir détails">
                                    Détails
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="utilisateursFiltres.length === 0" class="text-center py-8">
                <Icon icon="mdi:account-group" class="text-6xl text-gray-300 mb-4" />
                <p class="text-gray-500 text-lg">
                    {{ recherche || filtreStatut ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible' }}
                </p>
                <p class="text-sm text-gray-400 mt-2">
                    {{ recherche || filtreStatut ? 'Essayez de modifier vos filtres' : 'Les utilisateurs apparaîtront ici' }}
                </p>
            </div>
        </div>

        <UtilisateurDetailModal :show="showModal" :utilisateur="selectedUtilisateur" @close="showModal = false"
            @update="updateUtilisateur" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { utilisateurs as utilisateursData } from '@/data/utilisateurs'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import UtilisateurDetailModal from './UtilisateurDetailModal.vue'

const utilisateurs = ref(utilisateursData)
const filtreStatut = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedUtilisateur = ref(null)

const utilisateursFiltres = computed(() => {
    let result = utilisateurs.value

    if (filtreStatut.value) {
        result = result.filter(user => user.statut === filtreStatut.value)
    }

    if (recherche.value) {
        const term = recherche.value.toLowerCase()
        result = result.filter(user =>
            user.prenom.toLowerCase().includes(term) ||
            user.nom.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.telephone.toLowerCase().includes(term) ||
            user.id.toString().includes(term)
        )
    }

    return result
})

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
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
}

const voirDetails = (utilisateur) => {
    selectedUtilisateur.value = utilisateur
    showModal.value = true
}

const updateUtilisateur = (updates) => {
    const index = utilisateurs.value.findIndex(user => user.id === updates.id)
    if (index !== -1) {
        utilisateurs.value[index] = { ...utilisateurs.value[index], ...updates }
        alert(`Utilisateur ${utilisateurs.value[index].prenom} ${utilisateurs.value[index].nom} mis à jour !`)
    }
}
</script>