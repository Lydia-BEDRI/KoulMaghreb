<template>
  <main class="px-4 py-8 space-y-16">
    <section class="relative bg-gray-200 text-accent rounded-xl overflow-hidden shadow-md">
      <img src="/src/assets/img/banner.png" alt="Bannière KoulMaghreb"
        class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-br from-accent/80 via-primary/70 to-accent/80"></div>
      
      <div class="relative z-10 text-center py-16 px-4">
        <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Bienvenue chez KoulMaghreb
        </h1>
        
        <p class="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Découvrez l'authenticité de la cuisine du Maghreb
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <RouterLink 
            to="/nos-plats" 
            class="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 shadow-lg"
          >
            Découvrir nos plats
          </RouterLink>
          
          <RouterLink 
            to="/evenements" 
            class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm"
          >
            Voir les événements
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-4 flex items-center justify-center gap-3">
            <Icon icon="mdi:chef-hat" class="w-8 h-8 text-accent" />
            Explorez les Trois Cuisines du Maghreb
            <Icon icon="mdi:star" class="w-8 h-8 text-accent" />
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les traditions culinaires du Maroc, de l'Algérie et de la Tunisie
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Card Maroc -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div class="h-48 bg-gradient-to-br from-red-200 to-orange-200 flex items-center justify-center">
              <Icon icon="twemoji:flag-morocco" class="w-16 h-16" />
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-primary mb-2">Cuisine Marocaine</h3>
              <p class="text-gray-600 mb-4 flex-grow">Tajines parfumés, couscous royaux et pâtisseries aux amandes</p>
              <RouterLink 
                to="/cuisine-marocaine" 
                class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center justify-center gap-2 mt-auto"
              >
                <Icon icon="mdi:eye" class="w-4 h-4" />
                Découvrir
              </RouterLink>
            </div>
          </div>
          
          <!-- Card Algérie -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div class="h-48 bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
              <Icon icon="twemoji:flag-algeria" class="w-16 h-16" />
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-primary mb-2">Cuisine Algérienne</h3>
              <p class="text-gray-600 mb-4 flex-grow">Chorba généreuse, rechta savoureuse et couscous traditionnels</p>
              <RouterLink 
                to="/cuisine-algerienne" 
                class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center justify-center gap-2 mt-auto"
              >
                <Icon icon="mdi:eye" class="w-4 h-4" />
                Découvrir
              </RouterLink>
            </div>
          </div>
          
          <!-- Card Tunisie -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div class="h-48 bg-gradient-to-br from-red-200 to-yellow-200 flex items-center justify-center">
              <Icon icon="twemoji:flag-tunisia" class="w-16 h-16" />
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-primary mb-2">Cuisine Tunisienne</h3>
              <p class="text-gray-600 mb-4 flex-grow">Bricks croustillants, lablabi épicé et harissa authentique</p>
              <RouterLink 
                to="/cuisine-tunisienne" 
                class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition flex items-center justify-center gap-2 mt-auto"
              >
                <Icon icon="mdi:eye" class="w-4 h-4" />
                Découvrir
              </RouterLink>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <RouterLink 
            to="/nos-plats" 
            class="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent transition-all"
          >
            <span>Voir tous nos plats</span>
            <Icon icon="mdi:arrow-right" class="w-5 h-5" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Section équipe -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-4 flex items-center justify-center gap-3">
            <Icon icon="mdi:chef-hat" class="w-8 h-8 text-accent" />
            Notre Équipe de Chefs
            <Icon icon="mdi:star" class="w-8 h-8 text-accent" />
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Rencontrez les artisans passionnés qui donnent vie aux saveurs authentiques du Maghreb
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold hover:scale-105 transition-transform duration-300">
                AK
              </div>
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">Ahmed Khadiri</h3>
            <p class="text-accent font-medium mb-2">Chef Principal - Maroc</p>
            <p class="text-gray-600 text-sm">Spécialiste du couscous royal et des tajines traditionnels depuis 15 ans.</p>
          </div>
          
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-4xl font-bold hover:scale-105 transition-transform duration-300">
                LB
              </div>
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">Leila Benchikh</h3>
            <p class="text-accent font-medium mb-2">Chef Pâtissière - Algérie</p>
            <p class="text-gray-600 text-sm">Maître dans l'art des makrouds, cornes de gazelle et pâtisseries orientales.</p>
          </div>
          
          <div class="text-center group">
            <div class="relative mb-6">
              <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold hover:scale-105 transition-transform duration-300">
                MT
              </div>
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">Mohamed Trabelsi</h3>
            <p class="text-accent font-medium mb-2">Chef Spécialiste - Tunisie</p>
            <p class="text-gray-600 text-sm">Expert des plats tunisiens relevés et de la harissa artisanale.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section avantages -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-extrabold text-primary mb-4 flex items-center justify-center gap-3">
            <Icon icon="mdi:heart" class="w-8 h-8 text-accent" />
            Pourquoi Choisir KoulMaghreb ?
            <Icon icon="mdi:star-circle" class="w-8 h-8 text-accent" />
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Une expérience culinaire unique qui combine tradition, qualité et innovation
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon icon="mdi:leaf" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-4">Ingrédients 100% Naturels</h3>
            <p class="text-gray-600 leading-relaxed">
              Nous sélectionnons rigoureusement nos épices et ingrédients directement des producteurs du Maghreb pour une authenticité garantie.
            </p>
          </div>
          
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon icon="mdi:clock-fast" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-4">Livraison Express</h3>
            <p class="text-gray-600 leading-relaxed">
              Commandez en ligne et recevez vos plats chauds en moins de 30 minutes dans un rayon de 10km autour de Paris.
            </p>
          </div>
          
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon icon="mdi:shield-check" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-4">Qualité Garantie</h3>
            <p class="text-gray-600 leading-relaxed">
              Satisfait ou remboursé ! Notre engagement qualité nous permet de maintenir une note de 4.8/5 depuis 3 ans.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useSeo } from '@/composables/useSeo.js'

useSeo({
  title: 'Accueil - KoulMaghreb',
  description: "Bienvenue sur KoulMaghreb, le site dédié à la cuisine du Maghreb. Découvrez nos plats, nos chefs et nos événements culinaires marocains, algériens et tunisiens."
})
</script>

<style scoped>
.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}
</style>