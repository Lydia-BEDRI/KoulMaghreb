<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 class="text-xl font-semibold text-accent">Gestion des plats</h2>
                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {{ platsFiltres.length }} plat{{ platsFiltres.length > 1 ? 's' : '' }}
                </span>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <button 
                    @click="ajouterPlat"
                    class="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-accent transition flex items-center gap-2 font-medium"
                    title="Ajouter un nouveau plat"
                >
                    <Icon icon="mdi:plus" class="text-lg" />
                    Nouveau plat
                </button>
                <div class="flex gap-3">
                    <select 
                        v-model="filtrePays" 
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Tous les pays</option>
                        <option value="Algérie">Algérie</option>
                        <option value="Maroc">Maroc</option>
                        <option value="Tunisie">Tunisie</option>
                    </select>
                    <select 
                        v-model="filtreType" 
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Tous les types</option>
                        <option value="Entrée">Entrée</option>
                        <option value="Plat principal">Plat principal</option>
                        <option value="Dessert">Dessert</option>
                    </select>
                    <input 
                        v-model="recherche" 
                        placeholder="Rechercher..." 
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table class="w-full text-left text-sm border-separate border-spacing-y-2">
                <thead class="text-primary uppercase text-xs tracking-wide">
                    <tr>
                        <th class="py-2 px-3">ID</th>
                        <th class="py-2 px-3">Plat</th>
                        <th class="py-2 px-3">Prix</th>
                        <th class="py-2 px-3">Note</th>
                        <th class="py-2 px-3">Pays</th>
                        <th class="py-2 px-3">Type</th>
                        <th class="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="plat in platsFiltres" 
                        :key="plat.id"
                        class="bg-background hover:bg-orange-50 rounded transition-colors"
                    >
                        <td class="py-3 px-3 font-semibold text-gray-800">
                            {{ plat.id }}
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                    <img 
                                        :src="plat.image" 
                                        :alt="plat.nom"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">{{ plat.nom }}</p>
                                    <p class="text-xs text-gray-500">
                                      {{ (plat.shortDesc || plat.description || '').slice(0, 40) }}...
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-3">
                            <span class="font-semibold text-primary">{{ plat.prix }}€</span>
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex items-center gap-1">
                                <div class="flex gap-0.5 text-yellow-400">
                                    <Icon v-for="i in Math.floor(plat.note)" :key="i" icon="mdi:star" class="text-sm" />
                                    <Icon v-if="plat.note % 1 !== 0" icon="mdi:star-half-full" class="text-sm" />
                                    <Icon v-for="i in (5 - Math.ceil(plat.note))" :key="i + Math.ceil(plat.note)" icon="mdi:star-outline" class="text-sm text-gray-300" />
                                </div>
                                <span class="text-sm font-medium text-gray-600 ml-1">{{ plat.note }}/5</span>
                            </div>
                        </td>
                        <td class="py-3 px-3">
                            <span 
                                :class="getPaysClass(plat.pays)"
                                class="px-2 py-1 rounded-full text-xs font-semibold"
                            >
                                {{ plat.pays }}
                            </span>
                        </td>
                        <td class="py-3 px-3">
                            <span 
                                :class="getTypeClass(plat.type)"
                                class="px-2 py-1 rounded-full text-xs font-semibold"
                            >
                                {{ plat.type }}
                            </span>
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex gap-2">
                                <button 
                                    @click="voirDetails(plat)"
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
            <div v-if="platsFiltres.length === 0" class="text-center py-8">
                <Icon icon="mdi:food" class="text-6xl text-gray-300 mb-4" />
                <p class="text-gray-500 text-lg">
                    {{ recherche || filtrePays || filtreType ? 'Aucun plat trouvé' : 'Aucun plat disponible' }}
                </p>
                <p class="text-sm text-gray-400 mt-2">
                    {{ recherche || filtrePays || filtreType ? 'Essayez de modifier vos filtres' : 'Ajoutez votre premier plat' }}
                </p>
            </div>
        </div>
        <PlatDetailModal 
            :show="showModal"
            :plat="selectedPlat"
            :mode-creation="modeCreation"
            @close="showModal = false"
            @update="updatePlat"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import PlatDetailModal from './PlatDetailModal.vue'
import { platsService } from '@/services/platsService'

const plats = ref([])
const loading = ref(false)
const error = ref('')

const filtrePays = ref('')
const filtreType = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedPlat = ref(null)
const modeCreation = ref(false)

const getToken = () => localStorage.getItem('auth_token')

const chargerPlats = async () => {
    try {
        loading.value = true
        error.value = ''
        const token = getToken()
        const response = await platsService.getAll(1, 50)
        plats.value = response
    } catch (err) {
        error.value = err.message || 'Erreur lors du chargement des plats'
    } finally {
        loading.value = false
    }
}

onMounted(chargerPlats)

const platsFiltres = computed(() => {
    let result = plats.value
    if (filtrePays.value) {
        result = result.filter(plat => plat.pays === filtrePays.value)
    }
    if (filtreType.value) {
        result = result.filter(plat => plat.type === filtreType.value)
    }
    if (recherche.value) {
        const term = recherche.value.toLowerCase()
        result = result.filter(plat => 
            plat.nom?.toLowerCase().includes(term) ||
            plat.shortDesc?.toLowerCase().includes(term) ||
            plat.longDesc?.toLowerCase().includes(term) ||
            plat.pays?.toLowerCase().includes(term) ||
            plat.type?.toLowerCase().includes(term) ||
            plat.id?.toString().includes(term)
        )
    }
    return result
})

const getPaysClass = (pays) => {
    const classes = {
        'Algérie': 'bg-green-100 text-green-600',
        'Maroc': 'bg-red-100 text-red-600',
        'Tunisie': 'bg-blue-100 text-blue-600'
    }
    return classes[pays] || 'bg-gray-100 text-gray-600'
}

const getTypeClass = (type) => {
    const classes = {
        'Entrée': 'bg-orange-100 text-orange-600',
        'Plat principal': 'bg-purple-100 text-purple-600',
        'Dessert': 'bg-pink-100 text-pink-600'
    }
    return classes[type] || 'bg-gray-100 text-gray-600'
}

const voirDetails = (plat) => {
    selectedPlat.value = plat
    modeCreation.value = false
    showModal.value = true
}

const ajouterPlat = () => {
    selectedPlat.value = {
        id: null,
        nom: '',
        prix: 0,
        image: '',
        shortDesc: '',
        longDesc: '',
        pays: 'Algérie',
        type: 'Plat principal'
    }
    modeCreation.value = true
    showModal.value = true
}

const updatePlat = (updates) => {
    // Tu peux garder la logique existante pour la création/édition locale
    // Ou l'adapter pour utiliser l'API si tu veux persister côté serveur
    showModal.value = false
}
</script>
