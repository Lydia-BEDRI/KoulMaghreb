<script setup>
import { evenements } from '@/data/evenements.js'
import EvenementCard from './EvenementCard.vue'
</script>

<template>
    <div class="p-6 bg-background min-h-screen">
        <h1 class="text-2xl font-semibold mb-6 text-primary">Événements</h1>
        <p class="mb-8 text-base text-gray-700">
            Découvrez tous les événements à venir organisés par KoulMaghreb : ateliers, conférences, rencontres culturelles et bien plus encore. Restez informé et participez à la vie de notre communauté maghrébine !
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EvenementCard v-for="event in evenements" :key="event.id" :event="event" />
        </div>
    </div>
</template>