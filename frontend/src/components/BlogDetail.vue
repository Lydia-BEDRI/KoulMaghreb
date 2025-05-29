<template>
    <div class="max-w-4xl mx-auto p-6">
        <img :src="article.image" class="w-full max-h-96 object-cover rounded-lg mb-6" v-if="article"
            alt="Image de l'article" />
        <h1 class="text-4xl font-bold mb-2 text-primary">{{ article.title }}</h1>
        <p class="text-sm text-gray-500 mb-4">{{ article.created_at }} <span
                :class="getCategoryClass(article.category)" class="text-sm font-bold px-2 py-1 rounded">
                #{{ article.category }}
            </span></p>
        <p class="text-lg leading-7 whitespace-pre-line">{{ article.content }}</p>
    </div>
</template>

<script setup>
import { articles } from '@/data/articles'
import { useRoute } from 'vue-router'

const route = useRoute()
const article = articles.find(a => a.slug === route.params.slug)
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
</script>
