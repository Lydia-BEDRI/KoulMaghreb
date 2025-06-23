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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <label for="email" class="block text-base font-bold text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
              required
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
              <label for="codePostal" class="block text-base font-bold text-gray-700 mb-1">Code Postal</label>
              <input
                id="codePostal"
                v-model="form.codePostal"
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
        >
          Sauvegarder les modifications
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
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const activeTab = ref('profile')

const form = reactive({
  prenom: 'Lydia',
  nom: 'Bedri',
  email: 'lydia@mail.com',
  telephone: '+33 6 12 34 56 78',
  adresse: '10 rue du Soleil',
  codePostal: '77240'
})

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const submitProfile = () => {
  toast.success(`Profil mis à jour avec succès !`)
}

const submitSecurity = () => {
  if (security.newPassword !== security.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas.')
    return
  }
  toast.success('Mot de passe mis à jour avec succès !')
}

const getInitiales = (prenom, nom) => {
  return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase()
}
</script>
