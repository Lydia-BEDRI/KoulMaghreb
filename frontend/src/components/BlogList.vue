<template>
  <div class="p-6">
    <h1 class="text-4xl font-bold mb-4 text-primary">Nos articles culinaires</h1>
    <p class="text-gray-800 mb-6 text-lg">Découvrez nos derniers articles sur la cuisine, les recettes et les
      tendances culinaires.</p>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="article in articles" :key="article.id"
           class="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white">
        <router-link :to="`/blog/${article.slug}`">
          <img :src="article.image" :alt="`Image de l'article : ${article.title}`" class="rounded-lg h-48 w-full object-cover mb-4"/>
          <h2 class="text-xl font-semibold text-accent">{{ article.title }}</h2>
          <p class="text-sm text-gray-500 mb-2">
            {{ formatDate(article.created_at) }}
            <span :class="getCategoryClass(article.category)" class="text-sm font-bold px-2 py-1 rounded">
    #{{ article.category }}
  </span>
          </p>
          <p class="text-gray-700">{{ article.excerpt }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {articlesService} from '@/services/articlesService.js'
import { useSeo } from '@/composables/useSeo.js'

const articles = ref([])

async function loadArticles() {
  try {
    articles.value = await articlesService.getAll()
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error)
  }
}

onMounted(() => {
  loadArticles()
})

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
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
  title: 'Articles culinaires - KoulMaghreb',
  description: 'Découvrez nos articles sur la cuisine maghrébine, les recettes traditionnelles et les tendances culinaires du Maghreb.'
})
</script>
