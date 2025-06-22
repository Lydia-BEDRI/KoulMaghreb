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

          <img src="/logo.png" alt="Logo KoulMaghreb" class="h-16 w-auto mx-auto mb-4" />

          <h2 class="text-2xl font-bold text-center text-accent mb-2">Créer un compte</h2>
          <p class="text-sm text-center text-gray-500 mb-6">
            Étape {{ currentStep }} sur 2
          </p>

          <!-- ÉTAPE 1 -->
          <transition name="fade-slide" mode="out-in">
            <div v-if="currentStep === 1" key="step1">
              <form @submit.prevent="goToStep2" class="space-y-4">
                <div class="flex gap-4">
                  <input v-model="form.nom" type="text" placeholder="Nom"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input v-model="form.prenom" type="text" placeholder="Prénom"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <input v-model="form.email" type="email" placeholder="Adresse email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />

                <input v-model="form.password" type="password" placeholder="Mot de passe"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />

                <input v-model="form.confirmPassword" type="password" placeholder="Confirmer le mot de passe"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />

                <button type="submit"
                  class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition">Suivant</button>
              </form>
            </div>

            <div v-else key="step2">
              <form @submit.prevent="submitForm" class="space-y-4">
                <div class="flex gap-4 items-center">
                  <label class="flex items-center gap-2">
                    <input v-model="form.genre" type="radio" value="Femme"
                      class="accent-primary focus:ring-2 focus:ring-primary" />
                    Femme
                  </label>
                  <label class="flex items-center gap-2">
                    <input v-model="form.genre" type="radio" value="Homme"
                      class="accent-primary focus:ring-2 focus:ring-primary" />
                    Homme
                  </label>
                </div>

                <div class="flex gap-4">
                  <input v-model="form.adresse" type="text" placeholder="Adresse complète"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input v-model="form.codePostal" type="text" placeholder="Code postal"
                    class="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <input v-model="form.telephone" type="tel" placeholder="Numéro de téléphone"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />

                <input v-model="form.dateNaissance" type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />

                <div class="flex justify-between items-center mt-6">
                  <button type="button" @click="currentStep = 1"
                    class="text-gray-500 hover:text-primary transition font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                  </button>
                  <button type="submit"
                    class="bg-primary text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg hover:bg-accent transition font-semibold">
                    Créer mon compte
                  </button>
                </div>
              </form>
            </div>
          </transition>

          <p class="text-center text-sm text-gray-600 mt-6">
            Déjà inscrit ? 
            <a @click="modal.openLogin()" class="text-accent hover:underline cursor-pointer">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useModalStore } from '../stores/useModalStore'

const modal = useModalStore()

const currentStep = ref(1)

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  confirmPassword: '',
  genre: '',
  adresse: '',
  codePostal: '',
  telephone: '',
  dateNaissance: ''
})

const goToStep2 = () => {
  currentStep.value = 2
}

const submitForm = () => {
  console.log('Formulaire complet envoyé :', form.value)
}

function close() {
  modal.closeSignup()
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
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.modal-fade-enter-from {
  opacity: 0;
  transform: scale(0.9); 
}

.modal-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1); 
}

.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9); 
}
</style>
