<script setup>
import { reactive, toRefs } from 'vue'
import { useToast } from 'vue-toastification'
import { reservationsService } from '@/services/reservationsService'

const props = defineProps({
    eventId: {
        type: Number,
        required: true
    }
})

const toast = useToast()

const form = reactive({
    prenom: '',
    nom: '',
    email: '',
    nombrePlaces: 1,
    message: ''
})

const loading = reactive({ value: false })

async function submit() {
    if (!form.prenom || !form.nom || !form.email) {
        toast.error('Veuillez remplir tous les champs obligatoires.')
        return
    }

    loading.value = true
    try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
            toast.error('Vous devez être connecté pour réserver.')
            loading.value = false
            return
        }

        await reservationsService.createReservation({
            evenement_id: props.eventId,
            nombre_places: form.nombrePlaces
        }, token)

        toast.success(`Merci ${form.prenom}, votre réservation est bien enregistrée !`)

        form.prenom = ''
        form.nom = ''
        form.email = ''
        form.nombrePlaces = 1
        form.message = ''
    } catch (e) {
        toast.error(e.message || 'Erreur lors de la réservation')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <section class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-2xl mx-auto mt-6">
        <h2 class="text-xl font-semibold text-primary mb-2">Réserver une table</h2>
        <p class="text-sm text-gray-500 mb-4">Remplissez les champs pour réserver vos places pour cet événement.</p>

        <form @submit.prevent="submit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="form.prenom" type="text" placeholder="Prénom"
                    class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                    required />
                <input v-model="form.nom" type="text" placeholder="Nom"
                    class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                    required />
            </div>

            <input v-model="form.email" type="email" placeholder="Email"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary" required />

            <input v-model.number="form.nombrePlaces" type="number" min="1" placeholder="Nombre de places"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary" required />

            <textarea v-model="form.message" placeholder="Message (optionnel)" rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary resize-none"></textarea>

            <button type="submit" :disabled="loading.value" class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition">
                <span v-if="loading.value">Réservation en cours...</span>
                <span v-else>Valider la réservation</span>
            </button>
        </form>
    </section>
</template>
