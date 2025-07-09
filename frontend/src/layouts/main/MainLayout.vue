<script setup>
import Header from '@/components/Header.vue';
import LoginModal from '@/components/LoginModal.vue';
import Sidebar from '@/components/Sidebar.vue';
import SignupModal from '@/components/SignupModal.vue';
import { useModalStore } from '@/stores/useModalStore';

const modal = useModalStore();
</script>

<template>
  <div class="min-h-screen bg-background">
    <LoginModal v-if="modal.showLoginModal" />
    <SignupModal v-if="modal.showSignupModal" />

    <Header />

    <div class="lg:flex">
      <aside class="hidden lg:block lg:w-64 lg:min-h-screen lg:sticky lg:top-20 overflow-y-auto border-r bg-white">
        <Sidebar />
      </aside>

      <main class="flex-1 min-h-screen bg-background">
        <div class="p-3 lg:p-4">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
