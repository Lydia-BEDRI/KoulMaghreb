<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <Header />
  <div class="h-screen flex bg-background">
    <Sidebar class="w-64 h-screen border-r" />

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col items-center justify-center p-6">
      <h1 class="text-4xl font-bold text-primary mb-4">Hello KoulMaghreb 👋</h1>
      <p class="text-lg text-accent">Si tu vois ce texte joliment stylé, Tailwind CSS fonctionne ! 🎉</p>

      <div class="mt-8 grid grid-cols-2 gap-4">
        <div class="w-32 h-32 bg-primary text-white flex items-center justify-center font-semibold rounded-lg shadow-md">
          Primary
        </div>
        <div class="w-32 h-32 bg-accent text-white flex items-center justify-center font-semibold rounded-lg shadow-md">
          Accent
        </div>
        <div class="w-32 h-32 bg-background text-black flex items-center justify-center font-semibold rounded-lg shadow-md border">
          Background
        </div>
        <div class="w-32 h-32 bg-neutral text-black flex items-center justify-center font-semibold rounded-lg shadow-md border">
          Neutral
        </div>
      </div>

      <button class="mt-6 px-4 py-2 bg-primary hover:bg-accent text-white font-semibold rounded-lg shadow-md transition">
        Test Bouton 🍽️
      </button>
    </div>
  </div>
</template>

<style scoped></style>
