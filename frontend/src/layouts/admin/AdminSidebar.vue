<template>
  <transition name="fade">
    <aside
      v-show="show"
      class="fixed inset-0 z-40 bg-black bg-opacity-40 sm:hidden"
      @click.self="$emit('close')"
    >
      <nav
        class="w-64 bg-white shadow-lg border-r border-gray-200 p-6 h-full
               fixed left-0 top-0 bottom-0 z-50 transform transition-transform duration-200
               -translate-x-full"
        :class="{ 'translate-x-0': show }"
        @click.stop
      >
        <slot />
        <!-- ... menu ... -->
        <nav class="flex flex-col space-y-1" role="menu">
          <RouterLink
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            role="menuitem"
            class="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
            :class="{
              'bg-primary text-white font-semibold shadow-md': $route.path === item.to
            }"
          >
            <span class="ml-2">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </nav>
    </aside>
  </transition>

  <aside class="hidden sm:block w-64 bg-white shadow-lg border-r border-gray-200 h-full">
    <nav class="p-6 flex flex-col h-full">
      <slot />
      <!-- ... menu ... -->
            <RouterLink
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            role="menuitem"
            class="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
            :class="{
                'bg-primary text-white font-semibold shadow-md': $route.path === item.to
            }"
            >
            <span class="ml-2">{{ item.label }}</span>
            </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
const $route = useRoute()
const props = defineProps({ show: Boolean })
const emit = defineEmits(['close'])

const menu = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/orders', label: 'Commandes' },
  { to: '/admin/reservations', label: 'Réservations' },
  { to: '/admin/users', label: 'Utilisateurs' },
  { to: '/admin/evenements', label: 'Événements' },
  { to: '/admin/avis', label: 'Avis' },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/dishes', label: 'Plats' },
]

watch(() => $route.path, () => emit('close'))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
