<template>
    <div class="px-4 md:px-4 py-12 text-gray-800">
        <!-- Bannière -->
        <section
            class="bg-primary text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row items-center md:items-stretch justify-between">
            <div class="p-6 sm:p-8 md:p-10 w-full md:w-2/3 flex flex-col justify-center">
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
                    Découvrez la richesse de la cuisine algérienne
                </h2>
            </div>
            <div
                class="w-full md:w-1/3 flex justify-center md:justify-end items-end bg-primary py-4 md:py-6 pr-0 md:pr-6">
                <img src="/src/assets/img/cuisine-alg/cuisine-algerienne-ban.jpeg" alt="Cuisine algérienne"
                    class="w-40 h-28 sm:w-52 sm:h-36 md:w-60 md:h-40 object-cover rounded-lg shadow-lg" />
            </div>
        </section>

        <p class="mb-10 mt-8 text-lg leading-relaxed">
            La cuisine algérienne, ancrée dans des traditions séculaires, reflète la diversité culturelle du pays.
            Influencée par les civilisations berbères, arabes, andalouses et ottomanes, elle offre une palette de
            saveurs uniques. Chaque région a ses spécialités, mais toutes partagent un amour pour les plats
            généreux, les épices parfumées et les produits locaux.
        </p>

        <!-- Plats emblématiques -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Les plats incontournables de la cuisine algérienne</h2>
        <div class="grid md:grid-cols-2 gap-8 mb-12">
            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-alg/couscous-algerien.jpeg" alt="Couscous algérien traditionnel"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">Le couscous algérien</h3>
                <p>Plat national par excellence, préparé avec de la semoule, des légumes et de la viande.</p>
            </div>
            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-alg/chorba-algerienne.jpeg"
                    alt="Bol de chorba algérienne avec coriandre"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">La chorba</h3>
                <p>Soupe traditionnelle parfumée, souvent servie pendant le Ramadan.</p>
            </div>
            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-alg/rechta-poulet.jpeg" alt="Plat de rechta au poulet"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">La rechta</h3>
                <p>Nouilles fines maison accompagnées d’une sauce blanche et de poulet.</p>
            </div>
            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-alg/mtouem-algerien.jpeg" alt="M’touem constantinois en sauce rouge"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">Le m’touem</h3>
                <p>Boulettes de viande hachée à l’ail, servies dans une sauce rouge.</p>
            </div>
        </div>
        <!-- Ingrédients typiques -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Les ingrédients et épices phares de la cuisine algérienne
        </h2>
        <div class="grid md:grid-cols-2 gap-8 mb-12 items-center">
            <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li class="flex items-start">
                    <span class="text-accent font-bold mr-2">•</span>
                    <strong>Semoule</strong> – base du couscous
                </li>
                <li class="flex items-start">
                    <span class="text-accent font-bold mr-2">•</span>
                    <strong>Ail</strong> – très utilisé dans les sauces
                </li>
                <li class="flex items-start">
                    <span class="text-accent font-bold mr-2">•</span>
                    <strong>Ras el hanout</strong> – mélange d’épices complexe
                </li>
                <li class="flex items-start">
                    <span class="text-accent font-bold mr-2">•</span>
                    <strong>Paprika, cumin, coriandre</strong> – pour relever les plats
                </li>
                <li class="flex items-start">
                    <span class="text-accent font-bold mr-2">•</span>
                    <strong>Menthe & coriandre fraîche</strong>
                </li>
                <li class="flex items-start">
                    <span class="text-accent font-bold mr-2">•</span>
                    <strong>Harissa</strong> – pour une touche piquante
                </li>
                <li class="flex items-start">
                    <span class="text-accent font-bold mr-2">•</span>
                    <strong>Huile d’olive</strong> – ingrédient de base
                </li>
            </ul>

            <!-- Image des épices -->
            <div class="relative">
                <img src="/src/assets/img/cuisine-alg/epices-algeriennes.jpeg" alt="Épices algériennes"
                    class="rounded-2xl shadow-lg w-full h-64 object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                <p class="absolute bottom-4 left-4 text-white font-semibold text-lg">
                    Épices algériennes
                </p>
            </div>
        </div>

        <!-- Histoire et influences -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Une cuisine au carrefour des cultures</h2>
        <p class="mb-12">
            Héritage des Berbères, enrichie par les Arabes, les Ottomans, les Andalous et les influences françaises,
            la cuisine algérienne est un véritable carrefour de saveurs, reflétant l’histoire riche du pays.
        </p>

        <!-- Galerie photo -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Découvrez la cuisine algérienne en images</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div class="relative group">
                <img src="/src/assets/img/cuisine-alg/couscous-algerien.jpeg" alt="Couscous algérien traditionnel"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="relative group">
                <img src="/src/assets/img/cuisine-alg/chorba-algerienne.jpeg" alt="Chorba algérienne"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="relative group">
                <img src="/src/assets/img/cuisine-alg/rechta-poulet.jpeg" alt="Rechta au poulet"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="relative group">
                <img src="/src/assets/img/cuisine-alg/mtouem-algerien.jpeg" alt="M’touem en sauce rouge"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
        </div>


        <!-- Call to action -->
        <div class="mb-16">
            <h2 class="text-2xl font-semibold mb-10 text-primary text-center">Et si on vous emmenait en Algérie ? </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

                <div
                    class="bg-white border-2 border-primary rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:-translate-y-1 transition">
                    <CalendarDaysIcon class="w-12 h-12 text-primary mb-4" />
                    <p class="text-gray-700 mb-4">Profitez d’un moment authentique dans notre restaurant maghrébin.</p>
                    <RouterLink to="/restaurant"
                        class="bg-accent text-white font-medium px-4 py-2 rounded-lg hover:bg-primary transition">
                        Réserver
                    </RouterLink>
                </div>

                <div
                    class="bg-white border-2 border-primary rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:-translate-y-1 transition">
                    <BookOpenIcon class="w-12 h-12 text-primary mb-4" />
                    <p class="text-gray-700 mb-4">Découvrez toutes nos spécialités maison préparées avec passion.</p>
                    <RouterLink to="/menu"
                        class="bg-white text-accent font-medium px-4 py-2 border border-accent rounded-lg hover:bg-accent hover:text-white transition">
                        Voir le menu
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- FAQ -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Questions fréquentes sur la cuisine algérienne</h2>
        <div class="space-y-6">
            <div v-for="(item, index) in faqs" :key="index"
                class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition hover:shadow-lg hover:-translate-y-1">
                <button @click="toggle(index)"
                    class="w-full flex justify-between items-center p-5 text-left text-accent font-semibold hover:bg-neutral transition">
                    <span class="text-lg">{{ item.question }}</span>
                    <svg :class="openIndex === index ? 'rotate-180 text-accent' : 'text-gray-400'"
                        class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <transition name="faq-slide">
                    <div v-if="openIndex === index" class="px-5 pb-5 text-gray-600 text-base leading-relaxed">
                        {{ item.answer }}
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { CalendarDaysIcon, BookOpenIcon } from '@heroicons/vue/24/outline'

const openIndex = ref(null)

const toggle = (index) => {
    openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: "Quels sont les plats typiques algériens à ne pas manquer ?",
    answer: "Le couscous, la rechta, la chorba, la dolma, la chakhchoukha ou encore la m’touem sont incontournables, chacun représentant une région de l’Algérie."
  },
  {
    question: "Quelles sont les différences culinaires entre l’Est, l’Ouest et le Sud de l’Algérie ?",
    answer: "L’Est privilégie les plats en sauce comme la chorba et les tajines, l’Ouest est influencé par la cuisine andalouse avec des bricks et tajines sucrés-salés, tandis que le Sud propose des mets plus rustiques, souvent cuits dans le sable comme le medfouna."
  },
  {
    question: "Existe-t-il des plats végétariens en cuisine algérienne ?",
    answer: "Oui, de nombreux plats sont végétariens ou adaptables : tajines de légumes, mderbel, ratatouille algérienne, ou encore couscous aux pois chiches."
  },
  {
    question: "Quels pains accompagne-t-on traditionnellement avec les plats algériens ?",
    answer: "Le khobz eddar (pain maison), le matlouh (pain à la semoule) ou encore le kesra sont des pains traditionnels souvent faits à la main, parfaits pour saucer les plats."
  },
  {
    question: "Quels desserts algériens sont proposés en fin de repas ?",
    answer: "Baklawa, makrout, kalb el louz ou griwech sont des douceurs sucrées à base de semoule, de miel et d’amandes souvent servies avec un thé à la menthe ou un café."
  },
  {
    question: "Quel rôle joue la cuisine dans les fêtes traditionnelles algériennes ?",
    answer: "La cuisine est au cœur des célébrations : chaque fête (comme l’Aïd, Yennayer ou un mariage) s’accompagne de plats spécifiques préparés avec soin et partagés en famille."
  }
]
</script>

<style scoped>
img {
    object-fit: cover;
}

.faq-slide-enter-active,
.faq-slide-leave-active {
    transition: all 0.3s ease;
}

.faq-slide-enter-from,
.faq-slide-leave-to {
    max-height: 0;
    opacity: 0;
}

.faq-slide-enter-to,
.faq-slide-leave-from {
    max-height: 500px;
    opacity: 1;
}
</style>
