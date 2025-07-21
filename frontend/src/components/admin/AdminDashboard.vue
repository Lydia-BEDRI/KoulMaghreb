<script setup>
import StatCard from '@/components/admin/StatCard.vue'
import { ref, onMounted } from 'vue'
import { adminDashboardService } from '@/services/adminDashboardService'

const stats = ref({
  commandes: 0,
  reservations: 0,
  utilisateurs: 0,
  noteMoyenne: 0,
})

const commandes = ref([])
const reservations = ref([])
const platsFavoris = ref([])
const platsCommentes = ref([])

const statusColor = {
  'En attente': 'bg-yellow-100 text-yellow-600',
  'En préparation': 'bg-blue-100 text-blue-600',
  'Prête': 'bg-purple-100 text-purple-600',
  'En livraison': 'bg-orange-100 text-orange-600',
  'Livrée': 'bg-green-100 text-green-600',
  'Annulée': 'bg-red-100 text-red-600'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  stats.value = await adminDashboardService.getStats()
  commandes.value = await adminDashboardService.getCommandesRecentes()
  reservations.value = await adminDashboardService.getReservationsAvenir()
  platsFavoris.value = await adminDashboardService.getPlatsFavoris()
  platsCommentes.value = await adminDashboardService.getPlatsCommentes()
})
</script>

<template>
  <div class="space-y-10">
    <h1 class="text-2xl font-bold text-primary">Aperçu général</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Commandes" :value="stats.commandes" icon="mdi:cart-outline" />
      <StatCard title="Réservations" :value="stats.reservations" icon="mdi:calendar-outline" />
      <StatCard title="Utilisateurs" :value="stats.utilisateurs" icon="mdi:account-outline" />
      <StatCard title="Note moyenne" :value="stats.noteMoyenne" icon="mdi:star-outline" />
    </div>

    <section>
      <h2 class="text-lg font-semibold text-accent mb-3">Commandes récentes</h2>
      <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table class="w-full text-left text-sm border-separate border-spacing-y-2">
          <thead class="text-primary uppercase text-xs tracking-wide">
            <tr>
              <th class="py-2 px-2">Client</th>
              <th class="py-2 px-2">Plat</th>
              <th class="py-2 px-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cmd, index) in commandes" :key="index" class="bg-background hover:bg-orange-50 rounded">
              <td class="py-2 px-2 font-medium text-gray-800">{{ cmd.client }}</td>
              <td class="py-2 px-2">{{ cmd.nb_plats }}</td>
              <td class="py-2 px-2">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusColor[cmd.statut] || 'bg-gray-200 text-gray-700']">
                  {{ cmd.statut }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold text-accent mb-3">Réservations à venir</h2>
      <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table class="w-full text-left text-sm border-separate border-spacing-y-2">
          <thead class="text-primary uppercase text-xs tracking-wide">
            <tr>
              <th class="py-2 px-2">Date</th>
              <th class="py-2 px-2">Client</th>
              <th class="py-2 px-2">Personnes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(res, index) in reservations" :key="index" class="bg-background hover:bg-orange-50 rounded">
              <td class="py-2 px-2">{{ formatDate(res.evenement_date) }}</td>
              <td class="py-2 px-2">{{ res.client }}</td>
              <td class="py-2 px-2">{{ res.personnes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold text-accent mb-3">Plats les plus ajoutés en favoris</h2>
      <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table class="w-full text-left text-sm border-separate border-spacing-y-2">
          <thead class="text-primary uppercase text-xs tracking-wide">
            <tr>
              <th class="py-2 px-2">Plat</th>
              <th class="py-2 px-2">Favoris</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plat, index) in platsFavoris" :key="index" class="bg-background hover:bg-orange-50 rounded">
              <td class="py-2 px-2">{{ plat.nom }}</td>
              <td class="py-2 px-2">{{ plat.favoris }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold text-accent mb-3">Plats les plus commentés (avis)</h2>
      <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table class="w-full text-left text-sm border-separate border-spacing-y-2">
          <thead class="text-primary uppercase text-xs tracking-wide">
            <tr>
              <th class="py-2 px-2">Plat</th>
              <th class="py-2 px-2">Avis</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plat, index) in platsCommentes" :key="index" class="bg-background hover:bg-orange-50 rounded">
              <td class="py-2 px-2">{{ plat.nom }}</td>
              <td class="py-2 px-2">{{ plat.nb_avis }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
