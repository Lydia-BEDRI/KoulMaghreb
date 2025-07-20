<template>
    <transition name="modal-fade">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog" aria-modal="true" @click.self="$emit('close')">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden relative max-h-[90vh]">
                <div class="relative p-6 border-b">
                    <button @click="$emit('close')" aria-label="Fermer la fenêtre de détails"
                        class="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary hover:text-red-500 hover:scale-110 duration-150">
                        <Icon icon="mdi:close" class="text-xl" />
                    </button>

                    <h2 class="text-2xl font-bold text-center text-accent mb-2">
                        Détails de l'utilisateur
                    </h2>
                    <p class="text-sm text-center text-gray-500">
                        {{ utilisateur?.prenom }} {{ utilisateur?.nom }} - Gestion administrative
                    </p>
                </div>

                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-base font-bold text-gray-700 mb-1">ID Utilisateur</label>
                            <input :value="utilisateur?.id" disabled
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label class="block text-base font-bold text-gray-700 mb-1">Rôle</label>
                            <input 
                                :value="utilisateur?.role" 
                                disabled
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                            <p class="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                <Icon icon="mdi:lock" class="text-sm" />
                                Les rôles ne peuvent pas être modifiés pour des raisons de sécurité
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Informations personnelles</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Prénom</label>
                                <input :value="utilisateur?.prenom" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Nom</label>
                                <input :value="utilisateur?.nom" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>
                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Adresse email</label>
                                <input :value="utilisateur?.email" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Téléphone</label>
                                <input :value="utilisateur?.telephone || 'Non renseigné'" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>
                        <div class="mt-4 grid grid-cols-3 gap-4">
                            <div class="col-span-2">
                                <label class="block text-base font-bold text-gray-700 mb-1">Adresse</label>
                                <input :value="utilisateur?.adresse || 'Non renseignée'" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-base font-bold text-gray-700 mb-1">Code postal</label>
                                <input :value="utilisateur?.code_postal || 'Non renseigné'" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Date d'inscription</label>
                                <input :value="formatDate(utilisateur?.date_inscription || utilisateur?.created_at)" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Dernière connexion</label>
                                <input :value="formatDate(utilisateur?.last_login) || 'Jamais'" disabled
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Gestion du compte</h3>
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Statut du compte *</label>
                                <select v-model="editableUtilisateur.statut"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors">
                                    <option value="Actif">Actif</option>
                                    <option value="Inactif">Inactif</option>
                                    <option value="Suspendu">Suspendu</option>
                                </select>
                                <div class="mt-2 space-y-1 text-sm text-gray-500">
                                    <div class="flex items-start gap-2">
                                        <span class="inline-block mt-1 text-green-500">
                                            <Icon icon="mdi:check-circle" />
                                        </span>
                                        <span>
                                            <span class="font-semibold text-green-700">Actif :</span>
                                            L'utilisateur peut se connecter et utiliser toutes les fonctionnalités
                                        </span>
                                    </div>
                                    <div class="flex items-start gap-2">
                                        <span class="inline-block mt-1 text-orange-500">
                                            <Icon icon="mdi:pause-circle" />
                                        </span>
                                        <span>
                                            <span class="font-semibold text-orange-700">Suspendu :</span>
                                            L'utilisateur ne peut pas se connecter (suspension temporaire)
                                        </span>
                                    </div>
                                    <div class="flex items-start gap-2">
                                        <span class="inline-block mt-1 text-red-500">
                                            <Icon icon="mdi:close-circle" />
                                        </span>
                                        <span>
                                            <span class="font-semibold text-red-700">Inactif :</span>
                                            Compte définitivement désactivé (ne peut pas se connecter)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center p-6 border-t bg-gray-50">
                    <div class="text-sm text-gray-500">
                        <p>Créé le {{ formatDate(utilisateur?.created_at) }}</p>
                        <p v-if="hasChanges" class="text-orange-600 font-medium">⚠️ Modifications non sauvegardées</p>
                    </div>
                    
                    <div class="flex gap-3">
                        <button 
                            @click="$emit('close')"
                            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition rounded-xl hover:bg-gray-200 border border-gray-300"
                        >
                            Annuler
                        </button>
                        <button 
                            @click="sauvegarder"
                            :disabled="!hasChanges"
                            class="px-6 py-2 bg-primary text-white rounded-xl hover:bg-accent transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'

const props = defineProps({
    show: Boolean,
    utilisateur: Object
})

const emit = defineEmits(['close', 'update'])

const editableUtilisateur = ref({
    statut: '',
    role: ''
})

const originalUtilisateur = ref({
    statut: '',
    role: ''
})

const hasChanges = computed(() => {
    return editableUtilisateur.value.statut !== originalUtilisateur.value.statut ||
           editableUtilisateur.value.role !== originalUtilisateur.value.role
})

watch(() => props.utilisateur, (newUtilisateur) => {
    if (newUtilisateur) {
        const initial = {
            statut: newUtilisateur.statut || 'Actif',
            role: newUtilisateur.role || 'Client'
        }
        
        editableUtilisateur.value = { ...initial }
        originalUtilisateur.value = { ...initial }
    }
}, { immediate: true })

const formatDate = (date) => {
    if (!date) return 'Non disponible'
    try {
        return format(new Date(date), 'dd/MM/yyyy à HH:mm', { locale: fr })
    } catch (error) {
        return 'Date invalide'
    }
}

const sauvegarder = () => {
    if (!hasChanges.value) return
    
    emit('update', {
        id: props.utilisateur.id,
        statut: editableUtilisateur.value.statut,
        role: editableUtilisateur.value.role
    })
}
</script>

<style scoped>
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