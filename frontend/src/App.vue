<script setup>
import Header from './components/Header.vue'
import Home from './components/Home.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />
    <div class="flex flex-1 min-h-0">
      <Sidebar class="w-64 h-full border-r" />
      <main class="flex-1 overflow-y-auto bg-background">
        <Home />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
