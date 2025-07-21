<template>
    <transition name="modal-fade">
        <div
            v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            @click.self="$emit('close')"
        >
            <div
                class="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden relative max-h-[90vh]"
            >
                <div class="relative p-6 border-b">
                    <button
                        @click="$emit('close')"
                        aria-label="Fermer la fenêtre de détails"
                        class="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary hover:text-red-500 hover:scale-110 duration-150"
                    >
                        <Icon icon="mdi:close" class="text-xl" />
                    </button>
                    <h2 class="text-2xl font-bold text-center text-accent mb-2">
                        Détails de l'avis
                    </h2>
                    <p class="text-sm text-center text-gray-500">
                        Avis #{{ avis?.id }} - {{ avis?.client?.nom }} - Gestion administrative
                    </p>
                </div>
                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-base font-bold text-gray-700 mb-1">ID Avis</label>
                            <input 
                                :value="avis?.id" 
                                disabled 
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label class="block text-base font-bold text-gray-700 mb-1">Date de publication</label>
                            <input 
                                :value="formatDate(avis?.created_at)" 
                                disabled 
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Informations du client</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Nom du client</label>
                                <input 
                                    :value="avis?.client?.nom" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Email</label>
                                <input 
                                    :value="avis?.client?.email" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-base font-bold text-gray-700 mb-1">Téléphone</label>
                            <input 
                                :value="avis?.client?.telephone || 'Non renseigné'" 
                                disabled 
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Détails de l'avis</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Plat concerné</label>
                                <input 
                                    :value="avis?.plat?.nom + ' (' + avis?.plat?.prix + '€)'" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Note attribuée</label>
                                <div class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-2">
                                    <div class="flex gap-0.5 text-yellow-400">
                                        <Icon v-for="i in avis?.note" :key="i" icon="mdi:star" class="text-lg" />
                                        <Icon v-for="i in (5 - (avis?.note || 0))" :key="i + (avis?.note || 0)" icon="mdi:star-outline" class="text-lg text-gray-300" />
                                    </div>
                                    <span class="text-sm font-medium text-gray-600">{{ avis?.note }}/5</span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-base font-bold text-gray-700 mb-1">Commentaire du client</label>
                            <textarea 
                                :value="avis?.commentaire" 
                                disabled 
                                rows="4"
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed resize-none"
                            ></textarea>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Gestion de l'avis</h3>
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Statut de l'avis *</label>
                                <select 
                                    v-model="editableAvis.statut" 
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                >
                                    <option value="Publié">Publié</option>
                                    <option value="En attente">En attente</option>
                                </select>
                                <div class="mt-2 space-y-1">
                                    <div class="flex items-start gap-2">
                                        <span class="inline-block w-2 h-2 mt-1 rounded-full bg-green-400"></span>
                                        <span class="text-xs text-gray-600">
                                            <span class="font-semibold text-green-700">Publié</span> : L'avis est visible par tous les visiteurs
                                        </span>
                                    </div>
                                    <div class="flex items-start gap-2">
                                        <span class="inline-block w-2 h-2 mt-1 rounded-full bg-yellow-400"></span>
                                        <span class="text-xs text-gray-600">
                                            <span class="font-semibold text-yellow-700">En attente</span> : L'avis est en cours de modération
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button 
                        @click="$emit('close')"
                        class="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-800 transition rounded-xl hover:bg-gray-200"
                        title="Annuler"
                    >
                        <Icon icon="mdi:close" class="text-2xl" />
                    </button>
                    <button 
                        @click="sauvegarder"
                        class="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-xl hover:bg-accent transition shadow-md hover:shadow-lg"
                        title="Sauvegarder les modifications"
                    >
                        <Icon icon="mdi:content-save" class="text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Icon } from '@iconify/vue'

const props = defineProps({
    show: Boolean,
    avis: Object
})

const emit = defineEmits(['close', 'update'])

const editableAvis = ref({
    statut: ''
})

watch(() => props.avis, (newAvis) => {
    if (newAvis) {
        editableAvis.value = {
            statut: newAvis.statut || 'En attente'
        }
    }
}, { immediate: true })

const formatDate = (date) => {
    if (!date) return 'Non disponible'
    return format(new Date(date), 'dd/MM/yyyy à HH:mm', { locale: fr })
}

const sauvegarder = () => {
    emit('update', {
        id: props.avis.id,
        statut: editableAvis.value.statut
    })
    emit('close')
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
