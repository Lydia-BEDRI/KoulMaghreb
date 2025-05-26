<template>
  <main class="px-4 py-8 space-y-16">
    <!-- Section Bannière -->
    <section class="relative bg-gray-200 text-accent rounded-xl overflow-hidden shadow-md">
      <img src="/src/assets/img/banner.png" alt="Bannière KoulMaghreb" class="absolute inset-0 w-full h-full object-cover opacity-55" />
      <div class="relative z-10 text-center py-16 px-4">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">Découvrez la richesse culinaire du Maghreb</h1>
        <p class="text-lg md:text-xl max-w-2xl mx-auto text-gray-900">
          Réservez vos plats préférés, une table ou un événement en un clic. Une expérience authentique vous attend !
        </p>
        <a href="#reservation" class="inline-block mt-6 bg-accent text-white font-medium py-3 px-6 rounded-lg hover:bg-primary transition">
          Réservez maintenant
        </a>
      </div>
    </section>

    <!-- Section des cuisines -->
    <section>
      <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Nos cuisines maghrébines</h2>
      <p class="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
        Découvrez les saveurs uniques des cuisines maghrébines, chacune avec ses spécialités et son histoire.
      </p>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
          <img src="/src/assets/img/cuisine_mar.jpeg" alt="Cuisine Marocaine" class="w-full h-40 object-cover rounded-lg mb-4" />
          <h2 class="text-xl font-semibold text-primary mb-2">Cuisine Marocaine</h2>
          <p class="text-gray-600 text-center">Savourez les tajines, couscous, pastillas et autres spécialités marocaines dans toute leur authenticité.</p>
          <a href="#cuisine-marocaine" class="mt-6 bg-accent text-white font-medium py-2 px-4 rounded-lg hover:bg-primary transition">
            Découvrir
          </a>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
          <img src="/src/assets/img/cuisine_alg.jpeg" alt="Cuisine Algérienne" class="w-full h-40 object-cover rounded-lg mb-4" />
          <h2 class="text-xl font-semibold text-primary mb-2">Cuisine Algérienne</h2>
          <p class="text-gray-600 text-center">Dégustez les plats typiques comme la chorba, la rechta ou les boureks dans une ambiance chaleureuse.</p>
          <a href="#cuisine-algerienne" class="mt-6 bg-accent text-white font-medium py-2 px-4 rounded-lg hover:bg-primary transition">
            Découvrir
          </a>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
          <img src="/src/assets/img/cuisine_tun.jpeg" alt="Cuisine Tunisienne" class="w-full h-40 object-cover rounded-lg mb-4" />
          <h2 class="text-xl font-semibold text-primary mb-2">Cuisine Tunisienne</h2>
          <p class="text-gray-600 text-center">Laissez-vous tenter par les bricks, couscous tunisiens et plats épicés qui raviront vos papilles.</p>
          <a href="#cuisine-tunisienne" class="mt-6 bg-accent text-white font-medium py-2 px-4 rounded-lg hover:bg-primary transition">
            Découvrir
          </a>
        </div>
      </div>
    </section>

    <!-- Section Nos 3 chefs -->
    <section class="text-center">
      <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6">Nos 3 chefs maghrébins</h2>
      <p class="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
        Découvrez les talents de nos chefs passionnés, chacun expert dans la cuisine de son pays d’origine. Leur savoir-faire et leur créativité vous garantissent une expérience culinaire authentique et inoubliable.
      </p>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <img src="/chefs/chef1.jpeg" alt="Chef marocain" class="rounded-full w-24 h-24 mb-4 object-cover border-2 border-accent" />
          <h3 class="font-bold text-lg text-accent mb-2">Chef Rachid</h3>
          <p class="text-gray-600 text-sm">Spécialiste du tajine et de la pâtisserie marocaine.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <img src="/chefs/chef3.jpeg" alt="Chef algérien" class="rounded-full w-24 h-24 mb-4 object-cover border-2 border-accent" />
          <h3 class="font-bold text-lg text-accent mb-2">Chef Nassima</h3>
          <p class="text-gray-600 text-sm">Reine du couscous, bourek et de la cuisine kabyle.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <img src="/chefs/chef2.jpeg" alt="Chef tunisien" class="rounded-full w-24 h-24 mb-4 object-cover border-2 border-accent" />
          <h3 class="font-bold text-lg text-accent mb-2">Chef Sofien</h3>
          <p class="text-gray-600 text-sm">Expert des plats tunisiens relevés et de la harissa artisanale.</p>
        </div>
      </div>
    </section>

    <!-- Section Pourquoi nous choisir -->
    <section>
      <div class="max-w-4xl mx-auto text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-2 tracking-tight uppercase">Pourquoi nous choisir ?</h2>
        <p class="text-gray-700 text-base md:text-lg">
          Vous profitez de la meilleure qualité de plats maghrébins, d’un service rapide et d’une expérience authentique.
        </p>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <UserGroupIcon class="h-10 w-10 text-primary mb-4" />
          <h3 class="font-bold text-lg text-accent mb-2">Chefs passionnés</h3>
          <p class="text-gray-600 text-sm">Des plats faits maison par des chefs maghrébins expérimentés.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <StarIcon class="h-10 w-10 text-primary mb-4" />
          <h3 class="font-bold text-lg text-accent mb-2">Qualité supérieure</h3>
          <p class="text-gray-600 text-sm">Notre cuisine est reconnue pour sa qualité et son authenticité.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <TruckIcon class="h-10 w-10 text-primary mb-4" />
          <h3 class="font-bold text-lg text-accent mb-2">Livraison rapide</h3>
          <p class="text-gray-600 text-sm">Commandez et faites-vous livrer rapidement chez vous ou au bureau.</p>
        </div>
      </div>
    </section>

    <!-- Section Actualités -->
    <section>
      <div class="max-w-4xl mx-auto text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-4">Actualités</h2>
        <p class="text-gray-700 text-base md:text-lg">
          Découvrez nos dernières actualités, événements et nouveautés culinaires.
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-md p-6 flex flex-col hover:shadow-lg transition">
          <h3 class="font-bold text-lg text-primary mb-2">Nouvelle carte de saison</h3>
          <p class="text-gray-600 text-sm mb-4">
            Découvrez nos nouveaux plats inspirés des saveurs automnales, disponibles dès maintenant.
          </p>
          <div class="mt-auto">
            <a href="#news1" class="text-accent font-medium hover:underline">Lire plus</a>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6 flex flex-col hover:shadow-lg transition">
          <h3 class="font-bold text-lg text-primary mb-2">Soirée spéciale couscous</h3>
          <p class="text-gray-600 text-sm mb-4">
            Participez à notre soirée couscous avec musique live et ambiance maghrébine.
          </p>
          <div class="mt-auto">
            <a href="#news2" class="text-accent font-medium hover:underline">Lire plus</a>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6 flex flex-col hover:shadow-lg transition">
          <h3 class="font-bold text-lg text-primary mb-2">Atelier pâtisserie</h3>
          <p class="text-gray-600 text-sm mb-4">
            Rejoignez notre atelier pour apprendre à préparer des pâtisseries maghrébines.
          </p>
          <div class="mt-auto">
            <a href="#news3" class="text-accent font-medium hover:underline">Lire plus</a>
          </div>
        </div>
      </div>
      <div class="text-center mt-8">
        <a href="#all-news" class="bg-accent text-white font-medium py-3 px-6 rounded-lg hover:bg-primary transition">
          Voir toutes nos actualités
        </a>
      </div>
    </section>

    <!-- Section Témoignages -->
    <section class="py-12">
      <h2 class="text-2xl md:text-3xl font-bold text-center text-primary mb-8">Ce que nos clients disent</h2>
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
        <p class="text-gray-600 italic">"Un véritable voyage culinaire ! Les plats sont délicieux et l'accueil chaleureux."</p>
        <h4 class="mt-4 font-semibold text-accent">Amine B.</h4>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
        <p class="text-gray-600 italic">"J’ai retrouvé les saveurs de mon enfance. Je recommande les yeux fermés."</p>
        <h4 class="mt-4 font-semibold text-accent">Sonia M.</h4>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow  text-center">
        <p class="text-gray-600 italic">"Service rapide, plats authentiques, et ambiance conviviale !"</p>
        <h4 class="mt-4 font-semibold text-accent">Khaled T.</h4>
      </div>
      </div>
    </section>

  <!-- Section Notre histoire -->
  <section class="py-20 bg-white rounded-lg">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-4">
      <img src="/src/assets/img/our_story.jpeg" alt="Notre histoire" class="rounded-xl shadow-md w-full max-h-96 object-cover mx-auto" />
      <div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-4 text-center">Notre histoire</h2>
        <p class="text-gray-700 text-base md:text-lg mb-4">
          KoulMaghreb est né de l’envie de partager les trésors culinaires du Maghreb avec le plus grand nombre.
          Fondé par une équipe passionnée, notre restaurant mêle tradition et innovation pour offrir une expérience unique à chaque client.
        </p>
        <p class="text-gray-700 text-base md:text-lg">
          Grâce à nos chefs issus de différentes régions du Maghreb, nous proposons une carte authentique, riche et évolutive.
          Notre objectif : faire découvrir ou redécouvrir les plats qui font la fierté de notre culture.
        </p>
      </div>
    </div>
  </section>

  <!-- Section Localisation -->
  <section class="py-16 bg-white rounded-lg">
    <div class="max-w-6xl mx-auto text-center mb-10">
      <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-4">Où nous trouver ?</h2>
      <p class="text-gray-700 text-base md:text-lg">
        Venez nous rendre visite dans notre restaurant pour une expérience culinaire unique. Voici où nous sommes situés :
      </p>
    </div>
    <div class="max-w-4xl mx-auto">
      <!-- Carte intégrée -->
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154846816!3d37.77492977975962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0e2c5b1%3A0x4c8b8b8b8b8b8b8b!2sRestaurant!5e0!3m2!1sen!2sfr!4v1680000000000!5m2!1sen!2sfr" 
        width="100%" 
        height="400" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        class="rounded-xl shadow-md">
      </iframe>
    </div>
    <div class="text-center mt-8">
      <p class="text-gray-700 text-base md:text-lg">
        Adresse : 123 Rue des Saveurs, 75000 Paris, France
      </p>
      <a href="https://www.google.com/maps/dir/?api=1&destination=123+Rue+des+Saveurs,+75000+Paris,+France" 
         target="_blank" 
         class="mt-4 inline-block bg-accent text-white font-medium py-3 px-6 rounded-lg hover:bg-primary transition">
        Obtenir l'itinéraire
      </a>
    </div>
  </section>

  <!-- Bouton pour revenir en haut -->
  <button 
    v-show="showScrollTop" 
    @click="scrollToTop" 
    class="fixed bottom-6 right-6 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-primary transition">
    <ChevronUpIcon class="h-6 w-6" />
  </button>
  </main>
</template>

<script setup>
import { UserGroupIcon, TruckIcon, StarIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted, onUnmounted } from 'vue'

const showScrollTop = ref(false)
let homeContainer = null

const handleScroll = () => {
  if (homeContainer) {
    showScrollTop.value = homeContainer.scrollTop > 200 // Affiche le bouton après 200px de scroll
  }
}

const scrollToTop = () => {
  if (homeContainer) {
    homeContainer.scrollTo({ top: 0, behavior: 'smooth' }) // Remonte en haut avec un effet fluide
  }
}

onMounted(() => {
  homeContainer = document.querySelector('main') // Sélectionne le conteneur de Home
  if (homeContainer) {
    homeContainer.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (homeContainer) {
    homeContainer.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
button {
  z-index: 50;
}
</style>