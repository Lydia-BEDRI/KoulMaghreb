<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 class="text-xl font-semibold text-accent">Gestion des avis</h2>
                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {{ avisFiltres.length }} avis
                </span>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div class="flex gap-3">
                    <select 
                        v-model="filtreNote" 
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
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="Publié">Publié</option>
                        <option value="En attente">En attente</option>
                        <option value="Masqué">Masqué</option>
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
                        v-for="avis in avisFiltres" 
                        :key="avis.id"
                        class="bg-background hover:bg-orange-50 rounded transition-colors"
                    >
                        <td class="py-3 px-3 font-semibold text-gray-800">
                            {{ avis.id }}
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                                    {{ getInitiales(avis.client.nom) }}
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">{{ avis.client.nom }}</p>
                                    <p class="text-xs text-gray-500">{{ avis.client.email }}</p>
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
                                {{ avis.commentaire }}
                            </p>
                        </td>
                        <td class="py-3 px-3">
                            <p class="font-medium text-gray-800">{{ avis.plat.nom }}</p>
                            <p class="text-xs text-gray-500">{{ avis.plat.prix }}€</p>
                        </td>
                        <td class="py-3 px-3">
                            <span 
                                :class="getStatutClass(avis.statut)"
                                class="px-2 py-1 rounded-full text-xs font-semibold"
                            >
                                {{ avis.statut }}
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
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="avisFiltres.length === 0" class="text-center py-8">
                <Icon icon="mdi:comment-text" class="text-6xl text-gray-300 mb-4" />
                <p class="text-gray-500 text-lg">
                    {{ recherche || filtreNote || filtreStatut ? 'Aucun avis trouvé' : 'Aucun avis disponible' }}
                </p>
                <p class="text-sm text-gray-400 mt-2">
                    {{ recherche || filtreNote || filtreStatut ? 'Essayez de modifier vos filtres' : 'Les avis clients apparaîtront ici' }}
                </p>
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
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import AvisDetailModal from './AvisDetailModal.vue'

const avis = ref([
    {
        id: 1,
        client: {
            nom: 'Amel Benali',
            email: 'amel.benali@email.com',
            telephone: '+33 6 12 34 56 78'
        },
        note: 5,
        commentaire: 'Délicieux couscous, bien épicé et très généreux ! Je recommande vivement ce restaurant pour l\'authenticité de ses plats.',
        plat: {
            nom: 'Couscous Royal',
            prix: 18
        },
        statut: 'Publié',
        created_at: '2025-06-20T14:30:00'
    },
    {
        id: 2,
        client: {
            nom: 'Karim Djelloul',
            email: 'karim.djelloul@email.com',
            telephone: '+33 6 98 76 54 32'
        },
        note: 4,
        commentaire: 'Très bon plat, un peu salé pour moi mais le goût est authentique. Service rapide et personnel accueillant.',
        plat: {
            nom: 'Tajine de Poulet',
            prix: 16
        },
        statut: 'Publié',
        created_at: '2025-06-18T10:15:00'
    },
    {
        id: 3,
        client: {
            nom: 'Yasmine Zidane',
            email: 'yasmine.z@email.com',
            telephone: '+33 6 45 67 89 12'
        },
        note: 5,
        commentaire: 'Parfait ! Les saveurs me rappellent la cuisine de ma grand-mère. Merci pour ce voyage culinaire.',
        plat: {
            nom: 'Pastilla au Poulet',
            prix: 15
        },
        statut: 'Publié',
        created_at: '2025-06-15T19:45:00'
    },
    {
        id: 4,
        client: {
            nom: 'Mohamed Larbi',
            email: 'mohamed.larbi@email.com',
            telephone: '+33 6 33 44 55 66'
        },
        note: 3,
        commentaire: 'Correct sans plus. La présentation pourrait être améliorée et le service était un peu lent.',
        plat: {
            nom: 'Harira',
            prix: 8
        },
        statut: 'En attente',
        created_at: '2025-06-12T16:20:00'
    },
    {
        id: 5,
        client: {
            nom: 'Fatima Belkacem',
            email: 'fatima.belkacem@email.com',
            telephone: '+33 6 77 88 99 00'
        },
        note: 2,
        commentaire: 'Très déçue de ma commande. Les épices étaient trop fortes et la viande pas assez cuite.',
        plat: {
            nom: 'Chorba',
            prix: 10
        },
        statut: 'Masqué',
        created_at: '2025-06-10T12:30:00'
    },
    {
        id: 6,
        client: {
            nom: 'Rachid Benzema',
            email: 'rachid.b@email.com',
            telephone: '+33 6 11 22 33 44'
        },
        note: 4,
        commentaire: 'Bon restaurant, je reviendrai ! Les desserts sont particulièrement réussis.',
        plat: {
            nom: 'Makroud',
            prix: 5
        },
        statut: 'Publié',
        created_at: '2025-06-08T15:45:00'
    },
    {
        id: 7,
        client: {
            nom: 'Lina Amrani',
            email: 'lina.amrani@email.com',
            telephone: '+33 6 55 66 77 88'
        },
        note: 5,
        commentaire: 'Absolument délicieux ! Une explosion de saveurs dans chaque bouchée. Bravo au chef !',
        plat: {
            nom: 'Bricks à l\'œuf',
            prix: 7
        },
        statut: 'Publié',
        created_at: '2025-06-05T18:10:00'
    },
    {
        id: 8,
        client: {
            nom: 'Omar Mansouri',
            email: 'omar.mansouri@email.com',
            telephone: '+33 6 99 88 77 66'
        },
        note: 1,
        commentaire: 'Service catastrophique et nourriture froide. Je ne recommande absolument pas.',
        plat: {
            nom: 'Tajine de Poulet',
            prix: 16
        },
        statut: 'En attente',
        created_at: '2025-06-03T13:25:00'
    }
])

const filtreNote = ref('')
const filtreStatut = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedAvis = ref(null)

const avisFiltres = computed(() => {
    let result = avis.value

    if (filtreNote.value) {
        result = result.filter(av => av.note === parseInt(filtreNote.value))
    }

    if (filtreStatut.value) {
        result = result.filter(av => av.statut === filtreStatut.value)
    }

    if (recherche.value) {
        const term = recherche.value.toLowerCase()
        result = result.filter(av => 
            av.client.nom.toLowerCase().includes(term) ||
            av.client.email.toLowerCase().includes(term) ||
            av.commentaire.toLowerCase().includes(term) ||
            av.plat.nom.toLowerCase().includes(term) ||
            av.id.toString().includes(term)
        )
    }

    return result
})

const getStatutClass = (statut) => {
    const classes = {
        'Publié': 'bg-green-100 text-green-600',
        'En attente': 'bg-yellow-100 text-yellow-600',
        'Masqué': 'bg-red-100 text-red-600'
    }
    return classes[statut] || 'bg-gray-100 text-gray-600'
}

const getInitiales = (nom) => {
    if (!nom) return ''
    const parties = nom.trim().split(' ')
    return parties.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
}

const voirDetails = (avisItem) => {
    selectedAvis.value = avisItem
    showModal.value = true
}

const updateAvis = (updates) => {
    const index = avis.value.findIndex(av => av.id === updates.id)
    if (index !== -1) {
        avis.value[index] = { ...avis.value[index], ...updates }
        alert(`Avis #${avis.value[index].id} mis à jour !`)
    }
}
</script>
