<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { articlesService } from '@/services/articlesService.js'
import { useSeo } from '@/composables/useSeo.js'

const route = useRoute()
const article = ref(null)
const error = ref(null)

async function loadArticle() {
  try {
    const data = await articlesService.getBySlug(route.params.slug)
    article.value = data.article
  } catch (err) {
    error.value = 'Article not found'
  }
}

onMounted(() => {
  loadArticle()
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

function getCategoryClass(category) {
  switch (category) {
    case "Culture":
      return "text-red-600 font-semibold";
    case "Tradition":
      return "text-green-600 font-semibold";
    case "Ingrédients":
      return "text-yellow-600 font-semibold";
    case "Desserts":
      return "text-pink-600 font-semibold";
    case "Événements":
      return "text-blue-600 font-semibold";
    case "Rencontre":
      return "text-purple-600 font-semibold";
    default:
      return "text-gray-600";
  }
}

useSeo({
  title: article.value ? `${article.value.title} - KoulMaghreb` : 'Article - KoulMaghreb',
  description: article.value ? article.value.excerpt || article.value.title : 'Découvrez un article culinaire sur KoulMaghreb.'
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6" v-if="article">
    <img :src="article.image" v-if="article.image"
         :alt="`Image de l'article : ${article.title}`"
         class="w-full max-h-96 object-cover rounded-lg mb-6" />
    <h1 class="text-4xl font-bold mb-2 text-primary">{{ article.title }}</h1>
    <p class="text-sm text-gray-500 mb-4">
      {{ formatDate(article.created_at) }}
      <span :class="getCategoryClass(article.category)" class="text-sm font-bold px-2 py-1 rounded">
        #{{ article.category }}
      </span>
    </p>
    <p class="text-lg leading-7 whitespace-pre-line">{{ article.content }}</p>
  </div>
  <div v-else-if="error" class="text-red-600 text-center py-8">{{ error }}</div>
  <div v-else class="text-center py-8">Loading...</div>
</template>