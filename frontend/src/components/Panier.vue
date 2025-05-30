<template>
  <div class="p-6 bg-background min-h-screen">
    <h1 class="text-2xl font-semibold mb-4 text-primary">Validez votre panier et passez votre commande</h1>

    <div class="bg-white p-6 rounded-2xl shadow border border-gray-200">
      <section class="mb-6">
        <h2 class="text-xl font-medium mb-3">Récapitulatif de commande</h2>
        <div
          v-for="(item, index) in cartItems"
          :key="index"
          class="bg-white p-4 rounded-2xl mb-4 flex justify-between items-center shadow hover:shadow-lg hover:-translate-y-1 transition border border-gray-200"
        >
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              <img :src="item.image" alt="Image du produit" class="w-full h-full object-cover" />
            </div>
            <div>
              <p class="text-lg font-semibold text-primary">{{ item.name }}</p>
              <p class="text-sm text-gray-600">{{ item.price }}€ x {{ item.quantity }} = <span class="font-bold">{{ item.price * item.quantity }}€</span></p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button @click="decrement(index)" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition">
              -
            </button>
            <span class="text-lg font-semibold">{{ item.quantity }}</span>
            <button @click="increment(index)" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition">
              +
            </button>
            <button @click="removeItem(index)" class="ml-4">
              <TrashIcon class="w-6 h-6 text-red-500 hover:text-red-700 transition" />
            </button>
          </div>
        </div>
      </section>

      <section class="bg-neutral p-6 rounded-2xl shadow border-2 border-primary hover:shadow-lg hover:-translate-y-1 transition">
        <h2 class="text-xl font-medium mb-4">Résumé du paiement</h2>
        <div class="mb-2 flex justify-between">
          <span>Sous-total</span>
          <span>{{ subtotal }}€</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span>Taxe</span>
          <span>{{ tax }}€</span>
        </div>
        <hr class="my-4 border-primary h-2" />
        <div class="mb-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{{ total }}€</span>
        </div>
        <button class="w-full py-2 bg-accent text-white rounded-xl hover:bg-primary transition">Passer la commande</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon} from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

const cartItems = ref([
    { name: 'Couscous Royal', price: 18, quantity: 2, image: '/src/assets/img/cuisine-alg/couscous-algerien.jpeg' },
    { name: 'Tajine de Poulet', price: 16, quantity: 1, image: '/src/assets/img/cuisine-mar/tajine-poulet-citron.jpeg' },
    { name: 'Bricks à l\'œuf', price: 7, quantity: 3, image: '/src/assets/img/cuisine-tun/brik-oeuf.jpeg' },
    { name: 'Chorba', price: 8, quantity: 1, image: '/src/assets/img/cuisine-alg/chorba-algerienne.jpeg' },
    { name: 'Makroud', price: 5, quantity: 2, image: '/src/assets/img/cuisine-tun/makroudh.jpeg' },
])

const increment = (index) => {
  cartItems.value[index].quantity++
}

const decrement = (index) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--
  }
}

const removeItem = (index) => {
  cartItems.value.splice(index, 1)
}

const subtotal = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
)

const tax = computed(() => parseFloat((subtotal.value * 0.05).toFixed(2)))

const total = computed(() => parseFloat((subtotal.value + tax.value).toFixed(2)))
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}
</style>
