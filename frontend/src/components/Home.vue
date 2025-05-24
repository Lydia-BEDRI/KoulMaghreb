<template>
  <main class="px-4 py-8 space-y-12">


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
    <section class="pb-8">
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
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <SparklesIcon class="h-10 w-10 text-primary mb-4" />
          <h3 class="font-bold text-lg text-accent mb-2">Ambiance authentique</h3>
          <p class="text-gray-600 text-sm">Ambiance chaleureuse et événements maghrébins réguliers.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <ShieldCheckIcon class="h-10 w-10 text-primary mb-4" />
          <h3 class="font-bold text-lg text-accent mb-2">Paiement sécurisé</h3>
          <p class="text-gray-600 text-sm">Vos transactions sont protégées et confidentielles.</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition">
          <UserGroupIcon class="h-10 w-10 text-primary mb-4" />
          <h3 class="font-bold text-lg text-accent mb-2">Convivialité</h3>
          <p class="text-gray-600 text-sm">Un accueil chaleureux et une ambiance familiale à chaque visite.</p>
        </div>
      </div>
    </section>

    <!-- Section Actualités -->
    <section class="pb-12">
      <div class="max-w-4xl mx-auto text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-4">Actualités</h2>
        <p class="text-gray-700 text-base md:text-lg">
          Découvrez nos dernières actualités, événements et nouveautés culinaires.
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Actualité 1 -->
        <div class="bg-white rounded-xl shadow-md p-6 flex flex-col hover:shadow-lg transition">
          <h3 class="font-bold text-lg text-primary mb-2">Nouvelle carte de saison</h3>
          <p class="text-gray-600 text-sm mb-4">
            Découvrez nos nouveaux plats inspirés des saveurs automnales, disponibles dès maintenant.
          </p>
          <div class="mt-auto">
            <a href="#news1" class="text-accent font-medium hover:underline">Lire plus</a>
          </div>
        </div>
        <!-- Actualité 2 -->
        <div class="bg-white rounded-xl shadow-md p-6 flex flex-col hover:shadow-lg transition">
          <h3 class="font-bold text-lg text-primary mb-2">Soirée spéciale couscous</h3>
          <p class="text-gray-600 text-sm mb-4">
            Participez à notre soirée couscous avec musique live et ambiance maghrébine.
          </p>
          <div class="mt-auto">
            <a href="#news2" class="text-accent font-medium hover:underline">Lire plus</a>
          </div>
        </div>
        <!-- Actualité 3 -->
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
  </main>
</template>

<script setup>
import { UserGroupIcon, TruckIcon, SparklesIcon, StarIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
/* Tu peux adapter ou étendre les couleurs et polices ici */
</style>