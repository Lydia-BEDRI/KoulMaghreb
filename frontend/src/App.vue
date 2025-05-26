<script setup>
import Header from './components/Header.vue'
import Home from './components/Home.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <header class="h-20 flex-shrink-0">
      <Header />
    </header>

    <!-- Contenu principal -->
    <div class="flex flex-1 overflow-hidden">
      <aside class="w-64 flex-shrink-0 overflow-y-auto border-r">
        <Sidebar />
      </aside>

      <main class="flex-1 overflow-y-auto p-4 bg-background">
        <Home />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
