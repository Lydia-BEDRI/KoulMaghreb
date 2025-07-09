<template>
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-4xl mx-auto">
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
            <div
                class="px-4 py-2 rounded-full border border-primary font-semibold transition cursor-pointer"
                :class="activeTab === 'admin' ? 'bg-primary text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'"
                @click="activeTab = 'admin'"
            >
                Paramètres Admin
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
                        <label for="email" class="block text-base font-bold text-gray-700 mb-1">Email professionnel</label>
                        <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            placeholder="Email professionnel"
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
                <h3 class="text-lg font-semibold text-primary mb-4">Sécurité du compte administrateur</h3>
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
                    <p class="text-xs text-gray-500 mt-1">
                        Minimum 8 caractères avec majuscules, minuscules et chiffres
                    </p>
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

            <div v-if="activeTab === 'admin'" class="md:col-span-3 space-y-6">
                <h3 class="text-lg font-semibold text-primary mb-4">Paramètres d'administration</h3>
                
                <div class="bg-gray-50 rounded-xl p-6">
                    <h4 class="font-semibold text-gray-800 mb-4">Permissions actuelles</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex items-center gap-3">
                            <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            <span class="text-gray-700">Gestion des utilisateurs</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            <span class="text-gray-700">Gestion des commandes</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            <span class="text-gray-700">Gestion des plats</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            <span class="text-gray-700">Gestion des articles</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            <span class="text-gray-700">Gestion des avis</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                            <span class="text-gray-700">Gestion des événements</span>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-6">
                    <h4 class="font-semibold text-gray-800 mb-4">Préférences d'interface</h4>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">Notifications email pour nouvelles commandes</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input v-model="preferences.emailCommandes" type="checkbox" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">Notifications email pour nouveaux avis</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input v-model="preferences.emailAvis" type="checkbox" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">Affichage compact des tableaux</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input v-model="preferences.affichageCompact" type="checkbox" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    @click="submitPreferences"
                    class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition"
                >
                    Sauvegarder les préférences
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'

const toast = useToast()
const activeTab = ref('profile')

const form = reactive({
  prenom: 'Amine',
  nom: 'Djerad',
  email: 'amine.djerad@koulmaghreb.com',
  telephone: '+33 1 23 45 67 89'
})

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = reactive({
  emailCommandes: true,
  emailAvis: false,
  affichageCompact: true
})

const submitProfile = () => {
  toast.success('Profil administrateur mis à jour avec succès !')
}

const submitSecurity = () => {
  if (security.newPassword !== security.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas.')
    return
  }
  
  if (security.newPassword.length < 8) {
    toast.error('Le mot de passe doit contenir au moins 8 caractères.')
    return
  }
  
  toast.success('Mot de passe administrateur mis à jour avec succès !')
  security.currentPassword = ''
  security.newPassword = ''
  security.confirmPassword = ''
}

const submitPreferences = () => {
  toast.success('Préférences sauvegardées avec succès !')
}

const getInitiales = (prenom, nom) => {
  return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase()
}
</script>