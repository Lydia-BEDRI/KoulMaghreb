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
                class="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden relative max-h-[90vh]"
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
                        {{ modeCreation ? 'Créer un nouveau plat' : `Détails du plat` }}
                    </h2>
                    <p class="text-sm text-center text-gray-500">
                        {{ modeCreation ? 'Saisir les informations du plat' : plat?.nom + ' - Gestion administrative' }}
                    </p>
                </div>
                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-base font-bold text-gray-700 mb-1">ID Plat</label>
                            <input 
                                :value="modeCreation ? 'Généré automatiquement' : plat?.id" 
                                disabled 
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div v-if="!modeCreation && plat?.note">
                            <label class="block text-base font-bold text-gray-700 mb-1">Note actuelle (lecture seule)</label>
                            <div class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-2">
                                <div class="flex gap-0.5 text-yellow-400">
                                    <Icon v-for="i in Math.floor(plat.note)" :key="i" icon="mdi:star" class="text-lg" />
                                    <Icon v-if="plat.note % 1 !== 0" icon="mdi:star-half-full" class="text-lg" />
                                    <Icon v-for="i in (5 - Math.ceil(plat.note))" :key="i + Math.ceil(plat.note)" icon="mdi:star-outline" class="text-lg text-gray-300" />
                                </div>
                                <span class="text-sm font-medium text-gray-600">{{ plat.note }}/5</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Informations de base</h3>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Nom du plat *</label>
                                <input 
                                    v-model="editablePlat.nom"
                                    placeholder="Ex: Couscous Royal"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-base font-bold text-gray-700 mb-1">Prix (€) *</label>
                                    <input 
                                        v-model.number="editablePlat.prix"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="18"
                                        class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label class="block text-base font-bold text-gray-700 mb-1">Pays *</label>
                                    <select 
                                        v-model="editablePlat.pays"
                                        class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                    >
                                        <option value="Algérie">Algérie</option>
                                        <option value="Maroc">Maroc</option>
                                        <option value="Tunisie">Tunisie</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-base font-bold text-gray-700 mb-1">Type *</label>
                                    <select 
                                        v-model="editablePlat.type"
                                        class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                    >
                                        <option value="Entrée">Entrée</option>
                                        <option value="Plat principal">Plat principal</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Image URL *</label>
                                <input 
                                    v-model="editablePlat.image"
                                    placeholder="Ex: /src/assets/img/cuisine-alg/couscous-royal.jpeg"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Descriptions</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Description courte *</label>
                                <textarea 
                                    v-model="editablePlat.shortDesc"
                                    placeholder="Description courte affichée sur la carte..."
                                    rows="3"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
                                ></textarea>
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Description détaillée *</label>
                                <textarea 
                                    v-model="editablePlat.longDesc"
                                    placeholder="Description complète affichée sur la page de détail..."
                                    rows="6"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div v-if="editablePlat.image">
                        <h3 class="text-lg font-semibold text-primary mb-4">Aperçu de l'image</h3>
                        <div class="w-full max-w-md mx-auto">
                            <img 
                                :src="editablePlat.image" 
                                :alt="editablePlat.nom"
                                class="w-full h-48 object-cover rounded-xl border border-gray-200"
                                @error="$event.target.style.display = 'none'"
                            />
                        </div>
                    </div>
                    <div v-if="!modeCreation">
                        <h3 class="text-lg font-semibold text-primary mb-4">Statistiques</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Mots description courte</label>
                                <input 
                                    :value="editablePlat.shortDesc ? editablePlat.shortDesc.split(' ').length : 0" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Mots description longue</label>
                                <input 
                                    :value="editablePlat.longDesc ? editablePlat.longDesc.split(' ').length : 0" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Longueur nom</label>
                                <input 
                                    :value="editablePlat.nom ? editablePlat.nom.length : 0" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
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
                        :title="modeCreation ? 'Créer le plat' : 'Sauvegarder les modifications'"
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
import { Icon } from '@iconify/vue'

const props = defineProps({
    show: Boolean,
    plat: Object,
    modeCreation: Boolean
})

const emit = defineEmits(['close', 'update'])

const editablePlat = ref({
    nom: '',
    prix: 0,
    image: '',
    shortDesc: '',
    longDesc: '',
    pays: 'Algérie',
    type: 'Plat principal'
})

watch(() => props.plat, (newPlat) => {
    if (newPlat) {
        editablePlat.value = {
            nom: newPlat.nom || '',
            prix: newPlat.prix || 0,
            image: newPlat.image || '',
            shortDesc: newPlat.shortDesc || '',
            longDesc: newPlat.longDesc || '',
            pays: newPlat.pays || 'Algérie',
            type: newPlat.type || 'Plat principal'
        }
    }
}, { immediate: true })

const sauvegarder = () => {
    if (!editablePlat.value.nom || !editablePlat.value.prix || 
            !editablePlat.value.shortDesc || !editablePlat.value.longDesc || 
            !editablePlat.value.image) {
        alert('Veuillez remplir tous les champs obligatoires (*).')
        return
    }

    const updateData = {
        id: props.plat?.id,
        nom: editablePlat.value.nom,
        prix: parseFloat(editablePlat.value.prix),
        image: editablePlat.value.image,
        shortDesc: editablePlat.value.shortDesc,
        longDesc: editablePlat.value.longDesc,
        pays: editablePlat.value.pays,
        type: editablePlat.value.type
    }

    if (!props.modeCreation && props.plat?.note) {
        updateData.note = props.plat.note
    }

    emit('update', updateData)
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
