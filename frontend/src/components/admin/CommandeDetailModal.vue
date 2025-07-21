<!-- src/components/admin/CommandeDetailModal.vue -->
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
            Détails de la commande n° {{ commande?.numero_commande }}
          </h2>
          <p class="text-sm text-center text-gray-500">
             Gestion administrative
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-base font-bold text-gray-700 mb-1">ID Commande</label>
              <input 
                :value="commande?.id" 
                disabled 
                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-base font-bold text-gray-700 mb-1">Numéro de commande</label>
              <input 
                :value="commande?.numero_commande" 
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
                  :value="commande?.client?.nom || 'Client inconnu'" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Adresse email</label>
                <input 
                  :value="commande?.client?.email || 'Non renseigné'" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Téléphone</label>
                <input 
                  :value="commande?.client?.telephone || 'Non renseigné'" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Adresse</label>
                <input 
                  :value="formatAdresse(commande?.client)" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-primary mb-4">Gestion de la commande</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Statut *</label>
                <select 
                  v-model="editableCommande.statut" 
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                >
                  <option value="En attente">En attente</option>
                  <option value="En préparation">En préparation</option>
                  <option value="Prête">Prête</option>
                  <option value="En livraison">En livraison</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Montant total</label>
                <input 
                  :value="formatPrice(commande?.total)" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Date de commande</label>
                <input 
                  :value="formatDate(commande?.created_at)" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-base font-bold text-gray-700 mb-1">Dernière mise à jour</label>
                <input 
                  :value="formatDate(commande?.updated_at)" 
                  disabled 
                  class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-primary mb-4">Articles commandés</h3>
            <div v-if="commande?.items && commande.items.length > 0" class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700">Article</th>
                    <th class="px-4 py-3 text-center font-semibold text-gray-700">Quantité</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-700">Prix unitaire</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-700">Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in commande.items" :key="item.nom_plat" class="border-t hover:bg-gray-50 transition">
                    <td class="px-4 py-3 font-medium text-gray-800">{{ item.nom_plat }}</td>
                    <td class="px-4 py-3 text-center text-gray-600">{{ item.quantite }}</td>
                    <td class="px-4 py-3 text-right text-gray-600">{{ parseFloat(item.prix).toFixed(2) }} €</td>
                    <td class="px-4 py-3 text-right font-semibold text-primary">
                      {{ (parseFloat(item.prix) * parseInt(item.quantite)).toFixed(2) }} €
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50 font-semibold">
                  <tr>
                    <td colspan="3" class="px-4 py-3 text-right text-gray-700">Total :</td>
                    <td class="px-4 py-3 text-right text-primary text-lg">{{ formatPrice(commande?.total) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <Icon icon="mdi:package-variant" class="text-4xl mb-2" />
              <p>Aucun article dans cette commande</p>
            </div>
          </div>

          <div>
            <label class="block text-base font-bold text-gray-700 mb-1">Notes administrateur</label>
            <textarea 
              v-model="editableCommande.notesAdmin"
              placeholder="Ajouter des notes internes pour cette commande..."
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-between items-center p-6 border-t bg-gray-50">
          <div class="text-sm text-gray-500">
            <p>User ID: {{ commande?.user_id }}</p>
            <p v-if="commande?.updated_at">Modifiée le {{ formatDate(commande.updated_at) }}</p>
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
  commande: Object
})

const emit = defineEmits(['close', 'update'])

const editableCommande = ref({
  statut: '',
  notesAdmin: ''
})

const originalCommande = ref({
  statut: '',
  notesAdmin: ''
})

const hasChanges = computed(() => {
  return editableCommande.value.statut !== originalCommande.value.statut ||
         editableCommande.value.notesAdmin !== originalCommande.value.notesAdmin
})

watch(() => props.commande, (newCommande) => {
  if (newCommande) {
    const initial = {
      statut: newCommande.statut || 'En attente',
      notesAdmin: newCommande.notes_admin || ''
    }
    
    editableCommande.value = { ...initial }
    originalCommande.value = { ...initial }
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

const formatPrice = (price) => {
  if (!price && price !== 0) return '0,00 €'
  return parseFloat(price).toFixed(2) + ' €'
}

const formatAdresse = (client) => {
  if (!client) return 'Non renseigné'
  
  const adresse = client.adresse || ''
  const codePostal = client.code_postal || ''
  
  if (!adresse && !codePostal) return 'Non renseigné'
  if (adresse && codePostal) return `${adresse}, ${codePostal}`
  if (adresse) return adresse
  return codePostal
}

const sauvegarder = () => {
  if (!hasChanges.value) return
  
  emit('update', {
    id: props.commande.id,
    statut: editableCommande.value.statut,
    notesAdmin: editableCommande.value.notesAdmin
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