<script setup>
import { ref } from 'vue'
import AdminHeader from './AdminHeader.vue'
import AdminSidebar from './AdminSidebar.vue'

const showSidebar = ref(false)
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <AdminHeader @toggle-sidebar="showSidebar = !showSidebar" />

    <div class="flex flex-1 overflow-hidden">
      <AdminSidebar :show="showSidebar" @close="showSidebar = false" />

      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
