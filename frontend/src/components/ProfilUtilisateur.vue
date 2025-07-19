<template>
  <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-4xl mx-auto mt-6">
    <div class="flex gap-4 mb-6">
      <div
        class="px-4 py-2 rounded-full border border-primary font-semibold transition cursor-pointer"
        :class="activeTab === 'profile' ? 'bg-primary text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'"
        @click="activeTab = 'profile'"
      >
        Éditer le profil
      </div>
      <div
        class="px-4 py-2 rounded-full border border-primary font-semibold transition cursor-pointer"
        :class="activeTab === 'security' ? 'bg-primary text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'"
        @click="activeTab = 'security'"
      >
        Sécurité
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-600">Chargement du profil...</p>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-600">
      <p>{{ error }}</p>
      <button @click="loadUserData" class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent">
        Réessayer
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-if="activeTab === 'profile'" class="flex items-start justify-center md:justify-start">
        <div class="w-24 h-24 rounded-full bg-primary text-white font-bold flex items-center justify-center text-3xl">
          {{ getInitiales(form.prenom, form.nom) }}
        </div>
      </div>

      <form v-if="activeTab === 'profile'" @submit.prevent="submitProfile" class="md:col-span-2 space-y-8">
        <div>
          <h3 class="text-lg font-semibold text-primary mb-4">Informations personnelles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="prenom" class="block text-base font-bold text-gray-700 mb-1">Prénom</label>
              <input
                id="prenom"
                v-model="form.prenom"
                type="text"
                placeholder="Prénom"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label for="nom" class="block text-base font-bold text-gray-700 mb-1">Nom</label>
              <input
                id="nom"
                v-model="form.nom"
                type="text"
                placeholder="Nom"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div class="mt-6">
            <label for="email" class="block text-base font-bold text-gray-700 mb-1">
              Email
              <span class="text-sm text-gray-500 font-normal ml-2">(non modifiable)</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              readonly
              disabled
            />
          </div>
          <div class="mt-6">
            <label for="telephone" class="block text-base font-bold text-gray-700 mb-1">Téléphone</label>
            <input
              id="telephone"
              v-model="form.telephone"
              type="text"
              placeholder="Téléphone"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-primary mb-4">Adresse personnelle</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="adresse" class="block text-base font-bold text-gray-700 mb-1">Adresse</label>
              <input
                id="adresse"
                v-model="form.adresse"
                type="text"
                placeholder="Adresse"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label for="code_postal" class="block text-base font-bold text-gray-700 mb-1">Code Postal</label>
              <input
                id="code_postal"
                v-model="form.code_postal"
                type="text"
                placeholder="Code Postal"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition"
          :disabled="updating"
        >
          {{ updating ? 'Mise à jour...' : 'Sauvegarder les modifications' }}
        </button>
      </form>

      <form
        v-if="activeTab === 'security'"
        @submit.prevent="submitSecurity"
        class="md:col-span-3 space-y-6 max-w-md mx-auto"
      >
        <h3 class="text-lg font-semibold text-primary mb-4">Sécurité</h3>
        <div>
          <label for="currentPassword" class="block text-base font-bold text-gray-700 mb-1">Mot de passe actuel</label>
          <input
            id="currentPassword"
            v-model="security.currentPassword"
            type="password"
            placeholder="Mot de passe actuel"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label for="newPassword" class="block text-base font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
          <input
            id="newPassword"
            v-model="security.newPassword"
            type="password"
            placeholder="Nouveau mot de passe"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label for="confirmPassword" class="block text-base font-bold text-gray-700 mb-1">Confirmation</label>
          <input
            id="confirmPassword"
            v-model="security.confirmPassword"
            type="password"
            placeholder="Confirmation"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition"
        >
          Mettre à jour le mot de passe
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const toast = useToast()
const router = useRouter()
const { user, updateUserProfile, refreshUserData, isAuthenticated } = useAuth()
const activeTab = ref('profile')
const loading = ref(false)
const updating = ref(false)
const error = ref('')

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  adresse: '',
  code_postal: ''
})

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loadUserData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (!isAuthenticated.value) {
      throw new Error('Vous devez être connecté pour accéder à cette page')
    }
    
    if (user.value) {
      form.prenom = user.value.prenom || ''
      form.nom = user.value.nom || ''
      form.email = user.value.email || ''
      form.telephone = user.value.telephone || ''
      form.adresse = user.value.adresse || ''
      form.code_postal = user.value.code_postal || ''
    } else {
      const userData = await refreshUserData()
      
      if (userData) {
        form.prenom = userData.prenom || ''
        form.nom = userData.nom || ''
        form.email = userData.email || ''
        form.telephone = userData.telephone || ''
        form.adresse = userData.adresse || ''
        form.code_postal = userData.code_postal || ''
      }
    }
    
  } catch (err) {
    console.error('Erreur chargement profil:', err)
    error.value = err.message || 'Erreur lors du chargement du profil'
    
    if (err.message.includes('connecté')) {
      toast.error('Vous devez être connecté pour accéder à cette page')
      router.push('/')
    }
  } finally {
    loading.value = false
  }
}

const submitProfile = async () => {
  try {
    updating.value = true
    
    if (!form.prenom || !form.nom) {
      throw new Error('Les champs prénom et nom sont requis')
    }
    
    const userData = {
      prenom: form.prenom.trim(),
      nom: form.nom.trim(),
      telephone: form.telephone?.trim() || null,
      adresse: form.adresse?.trim() || null,
      code_postal: form.code_postal?.trim() || null
    }
    
    await updateUserProfile(userData)
    toast.success('Profil mis à jour avec succès !')
    
  } catch (err) {
    console.error('Erreur mise à jour profil:', err)
    toast.error(err.message || 'Erreur lors de la mise à jour du profil')
  } finally {
    updating.value = false
  }
}

const submitSecurity = () => {
  if (security.newPassword !== security.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas.')
    return
  }
  
  if (security.newPassword.length < 6) {
    toast.error('Le mot de passe doit contenir au moins 6 caractères.')
    return
  }
  
  toast.success('Mot de passe mis à jour avec succès !')
  security.currentPassword = ''
  security.newPassword = ''
  security.confirmPassword = ''
}

const getInitiales = (prenom, nom) => {
  return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase()
}

const formatDate = (date) => {
  if (!date) return 'Non disponible'
  try {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
  } catch (error) {
    return 'Date invalide'
  }
}

onMounted(() => {
  loadUserData()
})
</script>
