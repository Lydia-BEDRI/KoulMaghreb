<template>
  <div class="h-full p-6">
    <div class="mb-8">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Navigation</h3>
      <nav class="space-y-1">
        <SidebarItem icon="home" label="Accueil" to="/" />
        <SidebarItem icon="fire" label="Découvrir les plats" to="/decouvrir-les-plats" />
        <SidebarItem icon="list-bullet" label="Nos plats" to="/nos-plats" />
        <SidebarItem icon="calendar-days" label="Événements" to="/evenements" />
        <SidebarItem icon="newspaper" label="Blog / Actus" to="/blog" />
      </nav>
    </div>

    <div class="mb-8">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Mon espace</h3>
      <nav class="space-y-1">
        <SidebarItem icon="shield-check" label="Espace Administrateur" to="/admin/dashboard" />
        <SidebarItem icon="heart" label="Mes favoris" to="/mes-favoris" />
        <SidebarItem icon="shopping-cart" label="Mon panier" to="/mon-panier" />
        <SidebarItem icon="archive-box" label="Mes commandes" to="/mes-commandes" />
        <SidebarItem icon="ticket" label="Mes réservations" to="/mes-reservations" />
      </nav>
    </div>

    <div class="mb-8">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Cuisines</h3>
      <nav class="space-y-1">
        <SidebarItem icon="globe-alt" label="Cuisine marocaine" to="/cuisine-marocaine" />
        <SidebarItem icon="globe-alt" label="Cuisine algérienne" to="/cuisine-algerienne" />
        <SidebarItem icon="globe-alt" label="Cuisine tunisienne" to="/cuisine-tunisienne" />
      </nav>
    </div>

    <div class="pt-6 border-t border-gray-200">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Aide & Support</h3>
      <nav class="space-y-1">
        <SidebarItem icon="question-mark-circle" label="FAQ" to="/faq" />
        <SidebarItem icon="chat-bubble-left-ellipsis" label="Nous contacter" to="/contact" />
        <SidebarItem icon="document-text" label="Mentions légales" to="/mentions-legales" />
      </nav>
    </div>
  </div>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
</script>

<style scoped></style>