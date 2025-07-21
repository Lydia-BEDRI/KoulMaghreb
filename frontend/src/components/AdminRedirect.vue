<template>
  <div v-if="isRedirecting" class="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-600">Redirection vers l'espace administrateur...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated, isAdmin } = useAuth()
const router = useRouter()
const isRedirecting = ref(false)

onMounted(() => {
  if (isAuthenticated.value && isAdmin.value && !router.currentRoute.value.path.startsWith('/admin')) {
    isRedirecting.value = true
    setTimeout(() => {
      window.location.href = '/admin/dashboard'
    }, 1000)
  }
})
</script>