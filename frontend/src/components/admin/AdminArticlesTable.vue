<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 class="text-xl font-semibold text-accent">Gestion des articles</h2>
                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {{ articlesFiltres.length }} article{{ articlesFiltres.length > 1 ? 's' : '' }}
                </span>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <button 
                    @click="ajouterArticle"
                    class="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-accent transition flex items-center gap-2 font-medium"
                    title="Ajouter un nouvel article"
                >
                    <Icon icon="mdi:plus" class="text-lg" />
                    Nouvel article
                </button>
                <div class="flex gap-3">
                    <select 
                        v-model="filtreCategorie" 
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Toutes les catégories</option>
                        <option value="Culture">Culture</option>
                        <option value="Tradition">Tradition</option>
                        <option value="Ingrédients">Ingrédients</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Événements">Événements</option>
                        <option value="Rencontre">Rencontre</option>
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
                        <th class="py-2 px-3">Article</th>
                        <th class="py-2 px-3">Catégorie</th>
                        <th class="py-2 px-3">Extrait</th>
                        <th class="py-2 px-3">Date création</th>
                        <th class="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="article in articlesFiltres" 
                        :key="article.id"
                        class="bg-background hover:bg-orange-50 rounded transition-colors"
                    >
                        <td class="py-3 px-3 font-semibold text-gray-800">
                            {{ article.id }}
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                    <img 
                                        :src="article.image" 
                                        :alt="article.title"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">{{ article.title }}</p>
                                    <p class="text-xs text-gray-500">{{ article.slug }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-3">
                            <span 
                                :class="getCategorieClass(article.category)"
                                class="px-2 py-1 rounded-full text-xs font-semibold"
                            >
                                {{ article.category }}
                            </span>
                        </td>
                        <td class="py-3 px-3 max-w-xs">
                            <p class="text-gray-800 truncate" :title="article.excerpt">
                                {{ article.excerpt }}
                            </p>
                        </td>
                        <td class="py-3 px-3 text-gray-600">
                            {{ formatDate(article.created_at) }}
                        </td>
                        <td class="py-3 px-3">
                            <div class="flex gap-2">
                                <button 
                                    @click="voirDetails(article)"
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
            <div v-if="articlesFiltres.length === 0" class="text-center py-8">
                <Icon icon="mdi:newspaper" class="text-6xl text-gray-300 mb-4" />
                <p class="text-gray-500 text-lg">
                    {{ recherche || filtreCategorie ? 'Aucun article trouvé' : 'Aucun article disponible' }}
                </p>
                <p class="text-sm text-gray-400 mt-2">
                    {{ recherche || filtreCategorie ? 'Essayez de modifier vos filtres' : 'Ajoutez votre premier article' }}
                </p>
            </div>
        </div>
        <ArticleDetailModal 
            :show="showModal"
            :article="selectedArticle"
            :mode-creation="modeCreation"
            @close="showModal = false"
            @update="updateArticle"
        />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { articles as articlesData } from '@/data/articles'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'
import ArticleDetailModal from './ArticleDetailModal.vue'

const articles = ref(articlesData)
const filtreCategorie = ref('')
const recherche = ref('')

const showModal = ref(false)
const selectedArticle = ref(null)
const modeCreation = ref(false)

const articlesFiltres = computed(() => {
    let result = articles.value
    if (filtreCategorie.value) {
        result = result.filter(article => article.category === filtreCategorie.value)
    }
    if (recherche.value) {
        const term = recherche.value.toLowerCase()
        result = result.filter(article => 
            article.title.toLowerCase().includes(term) ||
            article.excerpt.toLowerCase().includes(term) ||
            article.category.toLowerCase().includes(term) ||
            article.slug.toLowerCase().includes(term) ||
            article.id.toString().includes(term)
        )
    }
    return result
})

const getCategorieClass = (category) => {
    const classes = {
        'Culture': 'bg-purple-100 text-purple-600',
        'Tradition': 'bg-orange-100 text-orange-600',
        'Ingrédients': 'bg-green-100 text-green-600',
        'Desserts': 'bg-pink-100 text-pink-600',
        'Événements': 'bg-blue-100 text-blue-600',
        'Rencontre': 'bg-yellow-100 text-yellow-600'
    }
    return classes[category] || 'bg-gray-100 text-gray-600'
}

const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
}

const voirDetails = (article) => {
    selectedArticle.value = article
    modeCreation.value = false
    showModal.value = true
}

const ajouterArticle = () => {
    selectedArticle.value = {
        id: null,
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'Culture',
        created_at: new Date().toISOString().split('T')[0]
    }
    modeCreation.value = true
    showModal.value = true
}

const creerArticle = (nouvelArticle) => {
    const nouvelId = Math.max(...articles.value.map(article => article.id)) + 1
    const articleComplet = {
        ...nouvelArticle,
        id: nouvelId
    }
    articles.value.unshift(articleComplet)
    alert(`Nouvel article "${articleComplet.title}" créé avec succès !`)
}

const updateArticle = (updates) => {
    if (modeCreation.value) {
        creerArticle(updates)
    } else {
        const index = articles.value.findIndex(article => article.id === updates.id)
        if (index !== -1) {
            articles.value[index] = { ...articles.value[index], ...updates }
            alert(`Article "${articles.value[index].title}" mis à jour !`)
        }
    }
}
</script>
