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

        <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-600">Chargement du profil...</p>
        </div>

        <div v-else-if="error" class="text-center py-8 text-red-600">
            <Icon icon="mdi:alert-circle" class="text-4xl mb-2" />
            <p class="mb-4">{{ error }}</p>
            <button 
                @click="loadUserData" 
                class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
            >
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
                            <label for="prenom" class="block text-base font-bold text-gray-700 mb-1">Prénom *</label>
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
                            <label for="nom" class="block text-base font-bold text-gray-700 mb-1">Nom *</label>
                            <input
                                id="nom"
                                v-model="form.nom"
                                type="text"
                                placeholder="Nom de famille"
                                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>
                    <div class="mt-6">
                        <label for="email" class="block text-base font-bold text-gray-700 mb-1">Email *</label>
                        <input
                            id="email"
                            :value="form.email"
                            type="email"
                            disabled
                            class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                        <p class="mt-1 text-xs text-gray-500 flex items-center gap-1">
                            <Icon icon="mdi:lock" class="text-sm" />
                            L'adresse email ne peut pas être modifiée pour des raisons de sécurité
                        </p>
                    </div>
                    <div class="mt-6">
                        <label for="telephone" class="block text-base font-bold text-gray-700 mb-1">Téléphone</label>
                        <div class="flex">
                            <span class="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                +33
                            </span>
                            <input
                                id="telephone"
                                v-model="form.telephone"
                                type="tel"
                                placeholder="1 02 34 56 78"
                                maxlength="14"
                                @input="formatTelephone"
                                @blur="validateTelephone"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.telephone }"
                            />
                        </div>
                        <p v-if="errors.telephone" class="mt-1 text-xs text-red-600">{{ errors.telephone }}</p>
                        <p v-else class="mt-1 text-xs text-gray-500">
                            Format: 1 02 34 56 78 (10 chiffres, commence par 1, 6 ou 7)
                        </p>
                    </div>
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="adresse" class="block text-base font-bold text-gray-700 mb-1">Adresse</label>
                            <input
                                id="adresse"
                                v-model="form.adresse"
                                type="text"
                                placeholder="123 rue de la Paix"
                                maxlength="100"
                                @blur="validateAdresse"
                                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.adresse }"
                            />
                            <p v-if="errors.adresse" class="mt-1 text-xs text-red-600">{{ errors.adresse }}</p>
                            <p v-else class="mt-1 text-xs text-gray-500">
                                Numéro et nom de rue (ex: 123 rue de la Paix)
                            </p>
                        </div>
                        <div>
                            <label for="code_postal" class="block text-base font-bold text-gray-700 mb-1">Code postal</label>
                            <input
                                id="code_postal"
                                v-model="form.code_postal"
                                type="text"
                                placeholder="75001"
                                maxlength="5"
                                pattern="[0-9]*"
                                @input="formatCodePostal"
                                @blur="validateCodePostal"
                                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.code_postal }"
                            />
                            <p v-if="errors.code_postal" class="mt-1 text-xs text-red-600">{{ errors.code_postal }}</p>
                            <p v-else class="mt-1 text-xs text-gray-500">
                                5 chiffres (ex: 75001, 13001)
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    :disabled="updating"
                    class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition disabled:opacity-50"
                >
                    {{ updating ? 'Sauvegarde...' : 'Sauvegarder les modifications' }}
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
                        :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordErrors.currentPassword }"
                        @input="clearPasswordErrors"
                        required
                    />
                    <p v-if="passwordErrors.currentPassword" class="mt-1 text-xs text-red-600">{{ passwordErrors.currentPassword }}</p>
                </div>
                <div>
                    <label for="newPassword" class="block text-base font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input
                        id="newPassword"
                        v-model="security.newPassword"
                        type="password"
                        placeholder="Nouveau mot de passe"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                        :class="{ 'border-red-500': passwordErrors.newPassword }"
                        @input="validateNewPassword"
                        required
                    />
                    <div v-if="passwordErrors.newPassword" class="mt-1 text-xs text-red-600">
                        {{ passwordErrors.newPassword }}
                    </div>
                    <div v-else class="mt-1 space-y-1 text-xs text-gray-500">
                        <div class="flex items-center gap-2">
                            <Icon :icon="passwordChecks.length ? 'mdi:check' : 'mdi:close'" 
                                  :class="passwordChecks.length ? 'text-green-500' : 'text-red-500'" />
                            <span>Au moins 8 caractères</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon :icon="passwordChecks.uppercase ? 'mdi:check' : 'mdi:close'" 
                                  :class="passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'" />
                            <span>Une majuscule</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon :icon="passwordChecks.lowercase ? 'mdi:check' : 'mdi:close'" 
                                  :class="passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'" />
                            <span>Une minuscule</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon :icon="passwordChecks.number ? 'mdi:check' : 'mdi:close'" 
                                  :class="passwordChecks.number ? 'text-green-500' : 'text-red-500'" />
                            <span>Un chiffre</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label for="confirmPassword" class="block text-base font-bold text-gray-700 mb-1">Confirmation</label>
                    <input
                        id="confirmPassword"
                        v-model="security.confirmPassword"
                        type="password"
                        placeholder="Confirmation"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                        :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordErrors.confirmPassword }"
                        @input="validateConfirmPassword"
                        required
                    />
                    <p v-if="passwordErrors.confirmPassword" class="mt-1 text-xs text-red-600">{{ passwordErrors.confirmPassword }}</p>
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
                    <h4 class="font-semibold text-gray-800 mb-4">Informations système</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="font-medium text-gray-600">ID Administrateur:</span>
                            <span class="ml-2 text-gray-800">{{ user?.id }}</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-600">Rôle:</span>
                            <span class="ml-2 text-gray-800">{{ user?.role }}</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-600">Statut:</span>
                            <span class="ml-2 text-green-600 font-medium">{{ user?.statut }}</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-600">Inscription:</span>
                            <span class="ml-2 text-gray-800">{{ formatDate(user?.date_inscription || user?.created_at) }}</span>
                        </div>
                    </div>
                </div>

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
import { reactive, ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { userService } from '@/services/userService'

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

const preferences = reactive({
    emailCommandes: true,
    emailAvis: false,
    affichageCompact: true
})

const errors = reactive({
    telephone: '',
    adresse: '',
    code_postal: ''
})

const passwordErrors = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const passwordChecks = reactive({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
})

const token = computed(() => localStorage.getItem('auth_token'))

const loadUserData = async () => {
    try {
        loading.value = true
        error.value = ''
        
        if (!isAuthenticated.value) {
            throw new Error('Vous devez être connecté pour accéder à cette page')
        }
        
        let userData = user.value
        if (!userData) {
            userData = await refreshUserData()
        }
        
        if (userData) {
            form.prenom = userData.prenom || ''
            form.nom = userData.nom || ''
            form.email = userData.email || ''
            
            // Extraire et formater le téléphone pour l'affichage
            if (userData.telephone) {
                let phone = userData.telephone
                
                // Si le format est "+33 6 12 34 56 78", extraire seulement "6 12 34 56 78"
                if (phone.startsWith('+33 ')) {
                    phone = phone.replace('+33 ', '')
                }
                
                // Si le format est "0612345678", le convertir
                if (phone.length === 10 && phone.startsWith('0')) {
                    phone = phone.slice(1) 
                    phone = phone.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
                }
                // Si c'est déjà formaté "6 12 34 56 78", on garde
                else if (phone.length === 13 && phone.includes(' ')) {
                    form.telephone = phone
                }
                // Si c'est "612345678" (9 chiffres), formater
                else if (phone.length === 9 && /^\d+$/.test(phone)) {
                    phone = phone.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
                }
                
                form.telephone = phone
            } else {
                form.telephone = ''
            }
            
            form.adresse = userData.adresse || ''
            form.code_postal = userData.code_postal || ''
        }
        
    } catch (err) {
        console.error('Erreur chargement profil admin:', err)
        error.value = err.message || 'Erreur lors du chargement du profil'
        
        if (err.message.includes('connecté')) {
            toast.error('Vous devez être connecté pour accéder à cette page')
            router.push('/admin')
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
        
        let isValid = true
        
        if (form.telephone) {
            isValid = validateTelephone() && isValid
        }
        
        if (form.adresse) {
            isValid = validateAdresse() && isValid
        }
        
        if (form.code_postal) {
            isValid = validateCodePostal() && isValid
        }
        
        if (!isValid) {
            throw new Error('Veuillez corriger les erreurs dans le formulaire')
        }
        
        const userData = {
            prenom: form.prenom.trim(),
            nom: form.nom.trim(),
            telephone: form.telephone ? `+33 ${form.telephone}` : null,
            adresse: form.adresse?.trim() || null,
            code_postal: form.code_postal?.trim() || null
        }
        
        await updateUserProfile(userData)
        toast.success('Profil administrateur mis à jour avec succès !')
        
    } catch (err) {
        console.error('Erreur mise à jour profil admin:', err)
        toast.error(err.message || 'Erreur lors de la mise à jour du profil')
    } finally {
        updating.value = false
    }
}

const submitSecurity = async () => {
    try {
        passwordErrors.currentPassword = ''
        passwordErrors.newPassword = ''
        passwordErrors.confirmPassword = ''
        
        if (!security.currentPassword) {
            passwordErrors.currentPassword = 'Le mot de passe actuel est requis'
            return
        }
        
        if (!security.newPassword) {
            passwordErrors.newPassword = 'Le nouveau mot de passe est requis'
            return
        }
        
        if (!security.confirmPassword) {
            passwordErrors.confirmPassword = 'La confirmation est requise'
            return
        }
        
        if (security.newPassword !== security.confirmPassword) {
            passwordErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
            return
        }
        
        if (security.newPassword.length < 8) {
            passwordErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
            return
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!passwordRegex.test(security.newPassword)) {
            passwordErrors.newPassword = 'Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
            return
        }
        
        if (security.currentPassword === security.newPassword) {
            passwordErrors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien'
            return
        }
        
        const result = await userService.changePassword(
            token.value,
            security.currentPassword,
            security.newPassword
        )
        
        toast.success('Mot de passe administrateur mis à jour avec succès !')
        
        security.currentPassword = ''
        security.newPassword = ''
        security.confirmPassword = ''
        
    } catch (err) {
        console.error('Erreur dans submitSecurity:', err)
        
        if (err.message.includes('Mot de passe actuel incorrect')) {
            passwordErrors.currentPassword = 'Mot de passe actuel incorrect'
            toast.error('Le mot de passe actuel que vous avez saisi est incorrect')
        } else if (err.message.includes('8 caractères')) {
            passwordErrors.newPassword = err.message
            toast.error(err.message)
        } else {
            toast.error(err.message || 'Erreur lors du changement de mot de passe')
        }
    }
}

const submitPreferences = () => {
    localStorage.setItem('admin_preferences', JSON.stringify(preferences))
    toast.success('Préférences sauvegardées avec succès !')
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

const formatTelephone = (event) => {
    let value = event.target.value.replace(/[^\d]/g, '') // Enlever tout sauf les chiffres
    
    if (value.length > 10) {
        value = value.slice(0, 10)
    }
    
    // Formater avec des espaces selon la longueur
    let formattedValue = ''
    
    if (value.length > 0) {
        formattedValue = value[0] // Premier chiffre
        
        if (value.length > 1) {
            formattedValue += ' ' + value.slice(1, 3) // Deuxième et troisième chiffres
        }
        
        if (value.length > 3) {
            formattedValue += ' ' + value.slice(3, 5) // Quatrième et cinquième chiffres
        }
        
        if (value.length > 5) {
            formattedValue += ' ' + value.slice(5, 7) // Sixième et septième chiffres
        }
        
        if (value.length > 7) {
            formattedValue += ' ' + value.slice(7, 9) // Huitième et neuvième chiffres
        }
        
        if (value.length > 9) {
            formattedValue += value.slice(9, 10) // Dixième chiffre
        }
    }
    
    form.telephone = formattedValue
    errors.telephone = ''
}

const validateTelephone = () => {
    const phoneDigits = form.telephone.replace(/[^\d]/g, '')
    
    if (!phoneDigits) {
        errors.telephone = ''
        return true
    }
    
    if (phoneDigits.length !== 10) {
        errors.telephone = 'Le numéro doit contenir exactement 10 chiffres'
        return false
    }
    
    // Accepter les numéros commençant par 1, 6 ou 7 
    if (!phoneDigits.startsWith('1') && !phoneDigits.startsWith('6') && !phoneDigits.startsWith('7')) {
        errors.telephone = 'Le numéro doit commencer par 1, 6 ou 7'
        return false
    }
    
    errors.telephone = ''
    return true
}

const validateAdresse = () => {
    if (!form.adresse) {
        errors.adresse = ''
        return true
    }
    
    const adresseValue = form.adresse.trim()
    
    if (adresseValue.length < 5) {
        errors.adresse = 'L\'adresse doit contenir au moins 5 caractères'
        return false
    }
    
    // Vérifier qu'il y a au moins un chiffre (numéro de rue)
    if (!/\d/.test(adresseValue)) {
        errors.adresse = 'L\'adresse doit contenir un numéro de rue'
        return false
    }
    
    // Vérifier qu'il y a au moins une lettre (nom de rue)
    if (!/[a-zA-ZÀ-ÿ]/.test(adresseValue)) {
        errors.adresse = 'L\'adresse doit contenir le nom de la rue'
        return false
    }
    
    // Vérifier les caractères autorisés
    if (!/^[a-zA-Z0-9À-ÿ\s\-',\.]+$/.test(adresseValue)) {
        errors.adresse = 'L\'adresse contient des caractères non autorisés'
        return false
    }
    
    errors.adresse = ''
    return true
}

const formatCodePostal = (event) => {
    let value = event.target.value.replace(/[^\d]/g, '') // Seulement des chiffres
    
    if (value.length > 5) {
        value = value.slice(0, 5)
    }
    
    form.code_postal = value
    errors.code_postal = ''
}

const validateCodePostal = () => {
    if (!form.code_postal) {
        errors.code_postal = ''
        return true
    }
    
    if (form.code_postal.length !== 5) {
        errors.code_postal = 'Le code postal doit contenir exactement 5 chiffres'
        return false
    }
    
    // Vérifier que c'est un code postal français valide
    const cp = parseInt(form.code_postal)
    if (cp < 1000 || cp > 98000) {
        errors.code_postal = 'Code postal français invalide'
        return false
    }
    
    errors.code_postal = ''
    return true
}

const validateNewPassword = () => {
    const password = security.newPassword
    
    passwordChecks.length = password.length >= 8
    passwordChecks.uppercase = /[A-Z]/.test(password)
    passwordChecks.lowercase = /[a-z]/.test(password)
    passwordChecks.number = /\d/.test(password)
    
    if (!password) {
        passwordErrors.newPassword = ''
        return
    }
    
    if (!passwordChecks.length) {
        passwordErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
    } else if (!passwordChecks.uppercase) {
        passwordErrors.newPassword = 'Le mot de passe doit contenir au moins une majuscule'
    } else if (!passwordChecks.lowercase) {
        passwordErrors.newPassword = 'Le mot de passe doit contenir au moins une minuscule'
    } else if (!passwordChecks.number) {
        passwordErrors.newPassword = 'Le mot de passe doit contenir au moins un chiffre'
    } else if (security.currentPassword && password === security.currentPassword) {
        passwordErrors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien'
    } else {
        passwordErrors.newPassword = ''
    }
    
    // Re-valider la confirmation si elle existe
    if (security.confirmPassword) {
        validateConfirmPassword()
    }
}

const clearPasswordErrors = () => {
    passwordErrors.currentPassword = ''
}

const validateConfirmPassword = () => {
    if (security.confirmPassword && security.newPassword !== security.confirmPassword) {
        passwordErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    } else {
        passwordErrors.confirmPassword = ''
    }
}

onMounted(() => {
    loadUserData()
    
    const savedPreferences = localStorage.getItem('admin_preferences')
    if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences)
        Object.assign(preferences, parsed)
    }
})
</script>