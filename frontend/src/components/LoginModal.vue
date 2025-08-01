<template>
  <div
    v-if="modal.showLoginModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="login-modal-title"
    aria-describedby="login-modal-desc"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative h-[550px]"
    >
      <div class="hidden md:block w-1/2 h-full">
        <img src="/img/login-illustration.jpeg" alt="Illustration de connexion" class="w-full h-full object-cover" />
      </div>

      <div class="w-full md:w-1/2 p-6 relative">
        <button
          @click="close"
          aria-label="Fermer la fenêtre de connexion"
          class="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary hover:text-red-500 hover:scale-110 duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-150" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex flex-col items-center gap-2 mb-6">
          <img src="/logo-mobile.png" alt="Logo KoulMaghreb" class="h-16 w-auto">
        </div>

        <h1 id="login-modal-title" class="text-xl font-semibold text-center text-accent mb-1">Bienvenue à nouveau !</h1>
        <p id="login-modal-desc" class="text-sm text-center text-gray-500 mb-4">Connectez-vous pour accéder à votre espace personnel</p>

        <form @submit.prevent="submit" autocomplete="on">
          <label class="sr-only" for="login-email">Email</label>
          <input 
            id="login-email" 
            v-model="form.email"
            type="email" 
            placeholder="Email"
            class="w-full mb-3 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
            required
            :disabled="loading"
          >
          <label class="sr-only" for="login-password">Mot de passe</label>
          <input 
            id="login-password" 
            v-model="form.password"
            type="password" 
            placeholder="Mot de passe"
            class="w-full mb-3 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
            required
            :disabled="loading"
          >

          <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {{ error }}
          </div>

          <div class="flex justify-between items-center mb-4 text-sm text-gray-600">
            <label class="flex items-center gap-1">
              <input type="checkbox" class="accent-primary">
              Se souvenir de moi
            </label>
            <a href="#" class="text-accent hover:underline text-sm">Mot de passe oublié ?</a>
          </div>

          <button 
            type="submit" 
            class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Connexion...' : 'Se Connecter' }}
          </button>
        </form>

        <div class="flex items-center my-4">
          <hr class="flex-grow border-gray-300">
          <span class="mx-2 text-gray-500 text-sm">ou</span>
          <hr class="flex-grow border-gray-300">
        </div>

        <div class="flex justify-center gap-4 mb-4">
          <img src="/google.png" alt="Connexion avec Google" class="w-6 h-6 cursor-pointer">
          <img src="/facebook.png" alt="Connexion avec Facebook" class="w-6 h-6 cursor-pointer">
          <img src="/apple.png" alt="Connexion avec Apple" class="w-6 h-6 cursor-pointer">
        </div>

        <p class="text-center text-sm text-gray-600">
          Pas encore de compte ?
          <a @click="switchToSignup" class="text-accent hover:underline cursor-pointer">S'inscrire</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useModalStore } from '../stores/useModalStore'
import { useAuth } from '../composables/useAuth'
import { useToast } from 'vue-toastification'
import { useSeo } from '@/composables/useSeo.js'

const modal = useModalStore()
const toast = useToast()
const router = useRouter()
const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

useSeo({
  title: 'Connexion à votre espace - KoulMaghreb',
  description: "Connectez-vous à votre espace personnel KoulMaghreb pour commander, réserver et gérer vos favoris."
})

function close() {
  modal.closeLogin()
  resetForm()
}

function resetForm() {
  form.email = ''
  form.password = ''
  error.value = ''
  loading.value = false
}

function switchToSignup() {
  modal.closeLogin()
  modal.openSignup()
}

const submit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const result = await login(form.email, form.password)
    
    toast.success('Connexion réussie !')
    close()
    
    if (result.user.role === 'Admin') { 
      window.location.href = '/admin/dashboard'
    } else {
      const panierLocal = JSON.parse(localStorage.getItem('panier') || '[]')
      if (panierLocal.length > 0) {
        setTimeout(() => {
          router.push('/mon-panier')
        }, 1000) 
      } else {
        router.push('/')
      }
    }
    
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
