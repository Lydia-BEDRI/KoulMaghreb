<script setup>
import { reactive } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const form = reactive({
    nom: '',
    email: '',
    nombrePlaces: 1,
    message: ''
})

function submit() {
    if (!form.prenom || !form.nom || !form.email) {
        toast.error('Veuillez remplir tous les champs obligatoires.')
        return
    }
    toast.success(`Merci ${form.prenom}, votre réservation est bien enregistrée !`);

    form.nom = ''
    form.email = ''
    form.nombrePlaces = 1
    form.message = ''
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

            <button type="submit" class="w-full bg-primary text-white py-2 rounded-xl hover:bg-accent transition">
                Valider la réservation
            </button>
        </form>
    </section>
</template>
