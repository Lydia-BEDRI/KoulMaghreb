<script setup>
import StatCard from '@/components/admin/StatCard.vue'
import { ref } from 'vue'

const stats = ref({
  commandes: 12,
  reservations: 5,
  utilisateurs: 45,
  noteMoyenne: 4.6,
})

const commandes = ref([
  { client: 'Amine D.', plat: 'Couscous', statut: 'Livrée' },
  { client: 'Yasmine Z.', plat: 'Tajine', statut: 'En cours' },
])

const reservations = ref([
  { date: '2025-07-05', client: 'Rachid B.', personnes: 4 },
  { date: '2025-07-06', client: 'Lina A.', personnes: 2 },
])

const plats = ref([
  { nom: 'Tajine', commandes: 27 },
  { nom: 'Couscous royal', commandes: 22 },
])

// Pour colorier les statuts
const statusColor = {
  'Livrée': 'text-green-600 bg-green-100',
  'En cours': 'text-orange-600 bg-orange-100',
  'Annulée': 'text-red-600 bg-red-100',
}
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
            <tr v-for="(cmd, index) in commandes" :key="index"
                class="bg-background hover:bg-orange-50 rounded">
              <td class="py-2 px-2 font-medium text-gray-800">{{ cmd.client }}</td>
              <td class="py-2 px-2">{{ cmd.plat }}</td>
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
              <td class="py-2 px-2">{{ res.date }}</td>
              <td class="py-2 px-2">{{ res.client }}</td>
              <td class="py-2 px-2">{{ res.personnes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold text-accent mb-3">Plats les plus populaires</h2>
      <div class="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table class="w-full text-left text-sm border-separate border-spacing-y-2">
          <thead class="text-primary uppercase text-xs tracking-wide">
            <tr>
              <th class="py-2 px-2">Plat</th>
              <th class="py-2 px-2">Commandes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plat, index) in plats" :key="index" class="bg-background hover:bg-orange-50 rounded">
              <td class="py-2 px-2">{{ plat.nom }}</td>
              <td class="py-2 px-2">{{ plat.commandes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
