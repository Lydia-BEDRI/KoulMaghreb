<template>
    <div class="bg-white p-6 rounded-2xl shadow-md mt-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            <div>
                <h2 class="text-2xl font-semibold text-primary mb-4">Avis récents</h2>
                <div class="overflow-y-auto max-h-80 pr-2 space-y-6">
                    <div v-for="commentaire in commentaires" :key="commentaire.id"
                        class="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition">
                        <div
                            class="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-lg">
                            {{ getInitiales(commentaire.nom) }}
                        </div>

                        <div class="flex-1">
                            <div class="flex justify-between items-center mb-1">
                                <h4 class="font-semibold text-primary">
                                    {{ commentaire.nom }}
                                    <span class="text-sm text-gray-500 ml-2"> {{ formatDate(commentaire.date) }}</span>
                                </h4>
                                <div class="flex gap-0.5 text-yellow-400">
                                    <Icon v-for="i in commentaire.note" :key="i" icon="mdi:star" class="text-sm" />
                                </div>
                            </div>
                            <p class="text-gray-700">{{ commentaire.texte }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-xl font-semibold text-primary mb-4">Laisser un avis</h3>
                <form @submit.prevent="soumettreAvis" class="space-y-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-700">Note :</label>
                        <div class="flex items-center gap-1">
                            <Icon v-for="i in 5" :key="i" :icon="i <= nouvelleNote ? 'mdi:star' : 'mdi:star-outline'"
                                class="text-yellow-400 text-2xl cursor-pointer" @click="nouvelleNote = i" />

                        </div>
                    </div>

                    <textarea v-model="nouveauCommentaire" placeholder="Écrivez votre avis ici..." rows="5"
                        class="bg-gray-50 w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"></textarea>

                    <button type="submit"
                        class="bg-primary text-white px-4 py-2 rounded-xl hover:bg-accent transition w-full">
                        Soumettre mon avis
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import fr from 'date-fns/locale/fr'
import { useToast } from 'vue-toastification'

const toast = useToast()

const commentaires = ref([
    {
        id: 1,
        nom: 'Amel B.',
        note: 5,
        texte: 'Délicieux couscous, bien épicé et très généreux ! Je recommande vivement.',
        date: '2025-06-20T14:30:00',
    },
    {
        id: 2,
        nom: 'Karim D.',
        note: 4,
        texte: 'Très bon plat, un peu salé pour moi mais le goût est authentique.',
        date: '2025-06-18T10:15:00',
    },
])

const nouvelleNote = ref(0)
const nouveauCommentaire = ref('')

const soumettreAvis = () => {
    if (!nouvelleNote.value || !nouveauCommentaire.value.trim()) {
        toast.error('Veuillez remplir tous les champs obligatoires.')
        return
    }

    commentaires.value.unshift({
        id: Date.now(),
        nom: 'Utilisateur Mystère',
        note: nouvelleNote.value,
        texte: nouveauCommentaire.value,
        date: new Date().toISOString(),
    })

    toast.success('Merci pour votre avis !')

    nouvelleNote.value = 0
    nouveauCommentaire.value = ''
}

const getInitiales = (nomComplet) => {
    if (!nomComplet) return ''
    const parties = nomComplet.trim().split(' ')
    return parties.slice(0, 2).map(m => m[0].toUpperCase()).join('')
}

const formatDate = (date) => format(new Date(date), 'dd/MM/yyyy  HH:mm', { locale: fr })
</script>
