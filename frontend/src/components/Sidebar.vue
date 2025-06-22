<template>
  <aside class="w-64 h-screen min-h-0 overflow-y-auto bg-white px-4 py-6 shadow-none border-none">
    <!-- Visiteur -->
    <div>
      <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Visiteur</h3>
      <nav class="flex flex-col gap-2">
        <SidebarItem icon="home" label="Accueil" to="/" />
        <SidebarItem icon="fire" label="Découvrir les plats" to="/decouvrir-les-plats" />
        <SidebarItem icon="globe-alt" label="Cuisine marocaine" to="/cuisine-marocaine" />
        <SidebarItem icon="globe-alt" label="Cuisine algérienne" to="/cuisine-algerienne" />
        <SidebarItem icon="globe-alt" label="Cuisine tunisienne" to="/cuisine-tunisienne" />
        <SidebarItem icon="calendar-days" label="Événements" to="/evenements" />
        <SidebarItem icon="question-mark-circle" label="FAQ" to="/faq" />
        <SidebarItem icon="chat-bubble-left-ellipsis" label="Contact" to="/contact" />
        <SidebarItem icon="newspaper" label="Blog / Actus" to="/blog" />
        <SidebarItem icon="document-text" label="Mentions légales" to="/mentions-legales" />
      </nav>
    </div>

    <!-- Client -->
    <div>
      <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Utilisateur connecté</h3>
      <nav class="flex flex-col gap-2">
        <SidebarItem icon="home" label="Accueil" to="/" />
        <SidebarItem icon="list-bullet" label="Nos plats" to="/nos-plats" />
        <SidebarItem icon="heart" label="Mes favoris" to="/mes-favoris" />
        <SidebarItem icon="shopping-cart" label="Mon panier" to="/mon-panier" />
        <SidebarItem icon="archive-box" label="Mes commandes" to="/mes-commandes" />
        <SidebarItem icon="calendar-days" label="Événements" to="/evenements" />
        <SidebarItem icon="ticket" label="Mes réservations" to="/mes-reservations" />
        <SidebarItem icon="chat-bubble-left-ellipsis" label="Contact" to="/contact" />
        <SidebarItem icon="question-mark-circle" label="FAQ" to="/faq" />
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