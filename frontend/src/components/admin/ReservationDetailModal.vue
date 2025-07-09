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
            {{ modeCreation ? 'Créer une nouvelle réservation' : `Détails de la réservation n° ${reservation?.numeroReservation}` }}
          </h2>
          <p class="text-sm text-center text-gray-500">
            {{ modeCreation ? 'Saisir les informations de la réservation' : 'Gestion administrative' }}
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-base font-bold text-gray-700 mb-1">ID Réservation</label>
              <input 
                :value="modeCreation ? 'Généré automatiquement' : reservation?.id" 
                disabled 
                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-base font-bold text-gray-700 mb-1">Numéro de réservation</label>
              <input 
                :value="modeCreation ? 'Généré automatiquement' : reservation?.numeroReservation" 
                disabled 
                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-primary mb-4">Informations Client</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Nom complet</label>
                <input 
                  v-model="editableReservation.client.nom"
                  :disabled="!modeCreation"
                  :class="modeCreation ? 'w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors' : 'w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed'"
                />
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Adresse email</label>
                <input 
                  v-model="editableReservation.client.email"
                  :disabled="!modeCreation"
                  :class="modeCreation ? 'w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors' : 'w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed'"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-base font-bold text-gray-700 mb-1">Téléphone</label>
              <input 
                v-model="editableReservation.client.telephone"
                :disabled="!modeCreation"
                :class="modeCreation ? 'w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors' : 'w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed'"
              />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-primary mb-4">Événement</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Titre de l'événement</label>
                <input 
                  :value="reservation?.evenement?.titre || 'Non renseigné'" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Date de l'événement</label>
                <input 
                  :value="formatDate(reservation?.evenement?.date)" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-base font-bold text-gray-700 mb-1">Lieu</label>
              <input 
                :value="reservation?.evenement?.lieu || 'Non renseigné'" 
                disabled 
                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-primary mb-4">Gestion de la réservation</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Statut *</label>
                <select 
                  v-model="editableReservation.statut" 
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                >
                  <option value="En attente">En attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="Annulée">Annulée</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Nombre de places</label>
                <input 
                  v-model.number="editableReservation.nombrePlaces"
                  type="number"
                  min="1"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Montant total</label>
                <input 
                  v-model.number="editableReservation.montantTotal"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-base font-bold text-gray-700 mb-1">Date de création</label>
              <input 
                :value="formatDate(reservation?.created_at)" 
                disabled 
                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label class="block text-base font-bold text-gray-700 mb-1">Notes administrateur</label>
            <textarea 
              v-model="editableReservation.notesAdmin"
              placeholder="Ajouter des notes internes pour cette réservation..."
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
            ></textarea>
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
            :title="modeCreation ? 'Créer la réservation' : 'Sauvegarder les modifications'"
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
  reservation: Object,
  modeCreation: Boolean
})

const emit = defineEmits(['close', 'update'])

const editableReservation = ref({
  statut: '',
  nombrePlaces: 1,
  montantTotal: 0,
  notesAdmin: '',
  client: {
    nom: '',
    email: '',
    telephone: ''
  }
})

watch(() => props.reservation, (newReservation) => {
  if (newReservation) {
    editableReservation.value = {
      statut: newReservation.statut || 'En attente',
      nombrePlaces: newReservation.nombrePlaces || 1,
      montantTotal: newReservation.montantTotal || 0,
      notesAdmin: newReservation.notesAdmin || '',
      client: {
        nom: newReservation.client?.nom || '',
        email: newReservation.client?.email || '',
        telephone: newReservation.client?.telephone || ''
      }
    }
  }
}, { immediate: true })

const formatDate = (date) => {
  if (!date) return 'Non disponible'
  return format(new Date(date), 'dd/MM/yyyy à HH:mm', { locale: fr })
}

const sauvegarder = () => {
  emit('update', {
    id: props.reservation?.id,
    statut: editableReservation.value.statut,
    nombrePlaces: editableReservation.value.nombrePlaces,
    montantTotal: editableReservation.value.montantTotal,
    notesAdmin: editableReservation.value.notesAdmin,
    client: editableReservation.value.client
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