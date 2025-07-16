<template>
    <div class="bg-white p-6 rounded-2xl shadow-md mt-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            <div>
                <h2 class="text-2xl font-semibold text-primary mb-4">Avis récents</h2>
                <div v-if="loading" class="text-center py-4">Chargement des avis...</div>
                <div v-else-if="error" class="text-red-600 text-center py-4">{{ error }}</div>
                <div v-if="commentaires.length === 0" class="text-gray-500 text-center py-4">
                    Aucun avis pour ce plat pour le moment.
                </div>
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
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import fr from 'date-fns/locale/fr'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'
import { avisService } from '@/services/avisService.js'

const toast = useToast()
const route = useRoute()
const commentaires = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const platId = route.params.id
    const data = await avisService.getByPlatId(platId, 10)
    commentaires.value = data.avis.map(a => ({
      id: a.id,
      nom: a.utilisateur?.nom || 'Utilisateur',
      note: a.note,
      texte: a.commentaire,
      date: a.created_at,
    }))
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const nouvelleNote = ref(0)
const nouveauCommentaire = ref('')
const token = localStorage.getItem('token')

const soumettreAvis = async () => {
  if(!token) {
    toast.error('Vous devez être connecté pour laisser un avis.')
    return
  }
  if (!nouvelleNote.value || !nouveauCommentaire.value.trim()) {
    toast.error('Veuillez remplir tous les champs obligatoires.')
    return
  }

  try {
    const platId = route.params.id
    // If you use authentication, get the token from your store or localStorage
    const token = localStorage.getItem('token') // adjust as needed
    await avisService.postAvis({
      plat_id: platId,
      note: nouvelleNote.value,
      commentaire: nouveauCommentaire.value
    }, token)

    toast.success('Merci pour votre avis ! Il sera visible après modération.')
    nouvelleNote.value = 0
    nouveauCommentaire.value = ''
    // Optionally reload comments here
  } catch (e) {
    toast.error(e.message)
  }
}

const getInitiales = (nomComplet) => {
    if (!nomComplet) return ''
    const parties = nomComplet.trim().split(' ')
    return parties.slice(0, 2).map(m => m[0].toUpperCase()).join('')
}

const formatDate = (date) => format(new Date(date), 'dd/MM/yyyy  HH:mm', { locale: fr })
</script>
