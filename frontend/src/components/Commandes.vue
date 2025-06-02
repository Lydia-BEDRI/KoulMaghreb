<template>
  <div class="p-6 bg-background min-h-screen">
    <h1 class="text-2xl font-semibold mb-6 text-primary">Mes commandes</h1>

    <div v-if="orders.length" class="space-y-6">
      <div
        v-for="(order, index) in orders"
        :key="order.id"
        class="bg-white rounded-2xl shadow border border-gray-200 p-6 transition hover:shadow-lg"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold text-primary">Commande #{{ order.id }}</p>
            <p class="text-sm text-gray-600">Date : {{ order.date }} | Total : {{ order.total }}€</p>
            <p class="text-sm mt-1" :class="order.status === 'Livrée' ? 'text-green-600' : 'text-yellow-600'">
              Statut : {{ order.status }}
            </p>
          </div>
          <button
            class="bg-accent text-white px-4 py-2 rounded-xl hover:bg-primary transition"
            @click="toggleDetails(index)"
          >
            {{ order.showDetails ? 'Masquer' : 'Détails' }}
          </button>
        </div>

        <!-- Détails de la commande -->
        <div v-if="order.showDetails" class="mt-4 border-t pt-4 space-y-3">
          <div
            v-for="(item, i) in order.items"
            :key="i"
            class="flex items-center justify-between border p-3 rounded-xl bg-neutral"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-base font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-600">{{ item.quantity }} × {{ item.price }}€</p>
              </div>
            </div>
            <p class="font-semibold text-primary">{{ item.quantity * item.price }}€</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-600 mt-10">
      <p>Vous n'avez pas encore passé de commande.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orders = ref([
  {
    id: 101,
    date: '2025-05-25',
    status: 'Livrée',
    total: 47,
    showDetails: false,
    items: [
      { name: 'Couscous Royal', price: 18, quantity: 1, image: '/src/assets/img/cuisine-alg/couscous-algerien.jpeg' },
      { name: 'Tajine de Poulet', price: 16, quantity: 1, image: '/src/assets/img/cuisine-mar/tajine-poulet-citron.jpeg' },
      { name: 'Makroud', price: 5, quantity: 2, image: '/src/assets/img/cuisine-tun/makroudh.jpeg' },
    ],
  },
  {
    id: 102,
    date: '2025-05-28',
    status: 'En cours',
    total: 24,
    showDetails: false,
    items: [
      { name: 'Bricks à l\'œuf', price: 7, quantity: 2, image: '/src/assets/img/cuisine-tun/brik-oeuf.jpeg' },
      { name: 'Chorba', price: 10, quantity: 1, image: '/src/assets/img/cuisine-alg/chorba-algerienne.jpeg' },
    ],
  },
])

const toggleDetails = (index) => {
  orders.value[index].showDetails = !orders.value[index].showDetails
}
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
