<script setup>
import Header from '@/components/Header.vue';
import LoginModal from '@/components/LoginModal.vue';
import Sidebar from '@/components/Sidebar.vue';
import SignupModal from '@/components/SignupModal.vue';
import { useModalStore } from '@/stores/useModalStore';

const modal = useModalStore();
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <LoginModal v-if="modal.showLoginModal" />
    <SignupModal v-if="modal.showSignupModal" />

    <header class="h-16 lg:h-20 flex-shrink-0 z-40">
      <Header />
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside class="hidden lg:block lg:w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <div class="h-full overflow-y-auto">
          <Sidebar />
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto bg-background">
        <div class="p-3 lg:p-4">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
