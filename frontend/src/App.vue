<script setup>
import Header from './components/Header.vue'
import LoginModal from './components/LoginModal.vue'
import SignupModal from './components/SignupModal.vue' // Import du composant SignupModal
import Sidebar from './components/Sidebar.vue'
import { useModalStore } from './stores/useModalStore'

const modal = useModalStore()
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <LoginModal v-if="modal.showLoginModal" />
    <SignupModal v-if="modal.showSignupModal" /> 

    <header class="h-20 flex-shrink-0">
      <Header />
    </header>

    <!-- Contenu principal -->
    <div class="flex flex-1 overflow-hidden">
      <aside class="w-64 flex-shrink-0 overflow-y-auto border-r">
        <Sidebar />
      </aside>

      <main class="flex-1 overflow-y-auto p-4 bg-background">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
