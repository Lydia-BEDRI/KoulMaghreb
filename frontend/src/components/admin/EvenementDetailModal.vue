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
            {{ modeCreation ? 'Créer un nouvel événement' : `Détails de l'événement` }}
          </h2>
          <p class="text-sm text-center text-gray-500">
            {{ modeCreation ? 'Saisir les informations de l\'événement' : evenement?.title + ' - Gestion administrative' }}
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-base font-bold text-gray-700 mb-1">ID Événement</label>
              <input 
                :value="modeCreation ? 'Généré automatiquement' : evenement?.id" 
                disabled 
                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-base font-bold text-gray-700 mb-1">Statut</label>
              <input 
                :value="modeCreation ? 'À venir' : getStatutFromDate(evenement?.date)" 
                disabled 
                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-primary mb-4">Informations de base</h3>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Titre de l'événement *</label>
                <input 
                  v-model="editableEvenement.title"
                  placeholder="Ex: Soirée Couscous & Musique Andalouse"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-base font-bold text-gray-700 mb-1">Date et heure *</label>
                  <input 
                    v-model="editableEvenement.date"
                    type="datetime-local"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-base font-bold text-gray-700 mb-1">Lieu *</label>
                  <input 
                    v-model="editableEvenement.lieu"
                    placeholder="Ex: Paris"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Image URL *</label>
                <input 
                  v-model="editableEvenement.image"
                  placeholder="Ex: /img/events/mon-evenement.jpeg"
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
                <input 
                  v-model="editableEvenement.shortDesc"
                  placeholder="Ex: Couscous et musique andalouse à Paris."
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Description générale *</label>
                <textarea 
                  v-model="editableEvenement.description"
                  placeholder="Description affichée sur la carte de l'événement..."
                  rows="3"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
                ></textarea>
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Description détaillée *</label>
                <textarea 
                  v-model="editableEvenement.longDesc"
                  placeholder="Description complète affichée sur la page de détail..."
                  rows="4"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
                ></textarea>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-primary mb-4">Gestion des places</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Places totales *</label>
                <input 
                  v-model.number="editableEvenement.placesTotal"
                  type="number"
                  min="1"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                />
              </div>
              <div v-if="!modeCreation">
                <label class="block text-base font-bold text-gray-700 mb-1">Places restantes</label>
                <input 
                  v-model.number="editableEvenement.placesRestantes"
                  type="number"
                  min="0"
                  :max="editableEvenement.placesTotal"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <div v-if="editableEvenement.image">
            <h3 class="text-lg font-semibold text-primary mb-4">Aperçu de l'image</h3>
            <div class="w-full max-w-md mx-auto">
              <img 
                :src="editableEvenement.image" 
                :alt="editableEvenement.title"
                class="w-full h-48 object-cover rounded-xl border border-gray-200"
                @error="$event.target.style.display = 'none'"
              />
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
            :title="modeCreation ? 'Créer l\'événement' : 'Sauvegarder les modifications'"
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
  evenement: Object,
  modeCreation: Boolean
})

const emit = defineEmits(['close', 'update'])

const editableEvenement = ref({
  title: '',
  date: '',
  lieu: '',
  image: '',
  description: '',
  shortDesc: '',
  longDesc: '',
  placesTotal: 50,
  placesRestantes: 50
})

const getStatutFromDate = (date) => {
  if (!date) return 'À venir'
  const now = new Date()
  const eventDate = new Date(date)
  
  if (eventDate > now) {
    return 'À venir'
  } else if (eventDate.toDateString() === now.toDateString()) {
    return 'En cours'
  } else {
    return 'Terminé'
  }
}

watch(() => props.evenement, (newEvenement) => {
  if (newEvenement) {
    const dateForInput = newEvenement.date ? 
      new Date(newEvenement.date).toISOString().slice(0, 16) : ''
    
    editableEvenement.value = {
      title: newEvenement.title || '',
      date: dateForInput,
      lieu: newEvenement.lieu || '',
      image: newEvenement.image || '',
      description: newEvenement.description || '',
      shortDesc: newEvenement.shortDesc || '',
      longDesc: newEvenement.longDesc || '',
      placesTotal: newEvenement.placesTotal || 50,
      placesRestantes: newEvenement.placesRestantes || newEvenement.placesTotal || 50
    }
  }
}, { immediate: true })

const sauvegarder = () => {
  if (!editableEvenement.value.title || !editableEvenement.value.date || 
      !editableEvenement.value.lieu || !editableEvenement.value.description) {
    alert('Veuillez remplir tous les champs obligatoires (*).')
    return
  }

  const dateISO = new Date(editableEvenement.value.date).toISOString()

  emit('update', {
    id: props.evenement?.id,
    title: editableEvenement.value.title,
    date: dateISO,
    lieu: editableEvenement.value.lieu,
    image: editableEvenement.value.image,
    description: editableEvenement.value.description,
    shortDesc: editableEvenement.value.shortDesc,
    longDesc: editableEvenement.value.longDesc,
    placesTotal: editableEvenement.value.placesTotal,
    placesRestantes: editableEvenement.value.placesRestantes
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