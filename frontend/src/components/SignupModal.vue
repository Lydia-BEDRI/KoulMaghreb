<template>
  <transition name="modal-fade">
    <div
      v-if="modal.showSignupModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative h-[550px]"
      >
        <div class="hidden md:block w-1/2 h-full">
          <img src="/img/login-illustration.jpeg" alt="Illustration d'inscription" class="w-full h-full object-cover" />
        </div>

        <div class="w-full md:w-1/2 p-6 relative">
          <button
            @click="close"
            aria-label="Fermer la fenêtre d'inscription"
            class="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary hover:text-red-500 hover:scale-110 duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-150" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img src="/logo-mobile.png" alt="Logo KoulMaghreb" class="h-16 w-auto mx-auto mb-4" />

          <h2 class="text-2xl font-bold text-center text-accent mb-2">Créer un compte</h2>
          <p class="text-sm text-center text-gray-500 mb-6">
            Étape {{ currentStep }} sur 2
          </p>

          <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {{ error }}
          </div>

          <!-- ÉTAPE 1 -->
          <transition name="fade-slide" mode="out-in">
            <div v-if="currentStep === 1" key="step1">
              <form @submit.prevent="goToStep2" class="space-y-4">
                <div class="flex gap-4">
                  <input v-model="form.nom" type="text" placeholder="Nom"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
                    required :disabled="loading" />
                  <input v-model="form.prenom" type="text" placeholder="Prénom"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
                    required :disabled="loading" />
                </div>

                <input v-model="form.email" type="email" placeholder="Adresse email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
                  required :disabled="loading" />

                <input v-model="form.password" type="password" placeholder="Mot de passe"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
                  required :disabled="loading" />

                <input v-model="form.confirmPassword" type="password" placeholder="Confirmer le mot de passe"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
                  required :disabled="loading" />

                <button type="submit"
                  class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition disabled:opacity-50"
                  :disabled="loading">
                  {{ loading ? 'Vérification...' : 'Suivant' }}
                </button>
              </form>
            </div>

            <div v-else key="step2">
              <form @submit.prevent="submitForm" class="space-y-4">
                <div class="flex gap-4">
                  <input v-model="form.adresse" type="text" placeholder="Adresse complète"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    :disabled="loading" />
                  <input v-model="form.code_postal" type="text" placeholder="Code postal"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    :disabled="loading" required />
                </div>

                <input v-model="form.telephone" type="tel" placeholder="Numéro de téléphone"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  :disabled="loading" />

                <div class="flex justify-between items-center mt-6">
                  <button type="button" @click="currentStep = 1"
                    class="text-gray-500 hover:text-primary transition font-medium flex items-center gap-2"
                    :disabled="loading">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                  </button>
                  <button type="submit"
                    class="bg-primary text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg hover:bg-accent transition font-semibold disabled:opacity-50"
                    :disabled="loading">
                    {{ loading ? 'Création...' : 'Créer mon compte' }}
                  </button>
                </div>
              </form>
            </div>
          </transition>

          <p class="text-center text-sm text-gray-600 mt-6">
            Déjà inscrit ? 
            <a @click="switchToLogin" class="text-accent hover:underline cursor-pointer">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useModalStore } from '../stores/useModalStore'
import { useAuth } from '../composables/useAuth'
import { useToast } from 'vue-toastification'

const modal = useModalStore()
const toast = useToast()
const router = useRouter()
const { register } = useAuth()

const currentStep = ref(1)
const loading = ref(false)
const error = ref('')

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  confirmPassword: '',
  adresse: '',
  code_postal: '', 
  telephone: ''
})

const goToStep2 = () => {
  // Validation étape 1
  if (form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (form.password.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  
  error.value = ''
  currentStep.value = 2
}

const submitForm = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Validation étape 2
    if (!form.code_postal || form.code_postal.length !== 5) {
      error.value = 'Le code postal doit contenir exactement 5 chiffres'
      return
    }
    
    if (!/^\d{5}$/.test(form.code_postal)) {
      error.value = 'Le code postal doit contenir uniquement des chiffres'
      return
    }
    
    console.log('Form data:', form)
    
    const userData = {
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      password: form.password,
      telephone: form.telephone || null,
      adresse: form.adresse || null,
      code_postal: form.code_postal
    }
    
    console.log('Données à envoyer:', userData)
    
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    console.log('Réponse du serveur:', data)
    
    if (!response.ok) {
      throw new Error(data.error || data.errors?.[0]?.msg || 'Erreur inscription')
    }
    
    toast.success('Inscription réussie !')
    
    close()
    
    if (data.user?.role === 'Admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }
    
  } catch (err) {
    console.error('Erreur complète:', err)
    error.value = err.message
    toast.error(err.message)
  } finally {
    loading.value = false
  }
}

function close() {
  modal.closeSignup()
  resetForm()
}

function resetForm() {
  currentStep.value = 1
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  error.value = ''
  loading.value = false
}

function switchToLogin() {
  modal.closeSignup()
  modal.openLogin()
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px); 
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0); 
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0); 
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
