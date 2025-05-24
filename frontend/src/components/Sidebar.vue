<template>
  <aside class="w-64 h-screen min-h-0 overflow-y-auto bg-white px-4 py-6 shadow-none border-none">
    <!-- Visiteur -->
    <div>
      <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Visiteur</h3>
      <nav class="flex flex-col gap-2">
        <SidebarItem icon="home" label="Accueil" :active="true" />
        <SidebarItem icon="fire" label="Découvrir les plats" />
        <SidebarItem icon="star" label="Recettes populaires" />
        <SidebarItem icon="globe-alt" label="Cuisine marocaine" />
        <SidebarItem icon="globe-alt" label="Cuisine algérienne" />
        <SidebarItem icon="globe-alt" label="Cuisine tunisienne" />
        <SidebarItem icon="question-mark-circle" label="FAQ" />
        <SidebarItem icon="chat-bubble-left-ellipsis" label="Contact" />
        <SidebarItem icon="newspaper" label="Blog / Actus" />
        <SidebarItem icon="document-text" label="Mentions légales" />
      </nav>
    </div>

    <!-- Client -->
    <div>
      <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Utilisateur connecté</h3>
      <nav class="flex flex-col gap-2">
        <SidebarItem icon="home" label="Accueil" />
        <SidebarItem icon="list-bullet" label="Nos plats" />
        <SidebarItem icon="heart" label="Mes favoris" />
        <SidebarItem icon="shopping-cart" label="Mon panier" />
        <SidebarItem icon="archive-box" label="Mes commandes" />
        <SidebarItem icon="chat-bubble-left-ellipsis" label="Contact" />
        <SidebarItem icon="question-mark-circle" label="FAQ" />
      </nav>
    </div>
  </aside>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
</script>

<style scoped>
aside {
  box-shadow: none !important;
  border-right: none !important;
}
</style>