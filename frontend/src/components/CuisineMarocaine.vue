<template>
    <div class="px-4 md:px-4 py-12 text-gray-800">
        <!-- Bannière -->
        <section
            class="bg-primary text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row items-center md:items-stretch justify-between">
            <div class="p-6 sm:p-8 md:p-10 w-full md:w-2/3 flex flex-col justify-center">
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
                    Explorez les saveurs authentiques de la cuisine marocaine
                </h2>
            </div>
            <div
                class="w-full md:w-1/3 flex justify-center md:justify-end items-end bg-primary py-4 md:py-6 pr-0 md:pr-6">
                <img src="/src/assets/img/cuisine-mar/cuisine-marocaine-ban.jpeg" alt="Cuisine marocaine"
                    class="w-40 h-28 sm:w-52 sm:h-36 md:w-60 md:h-40 object-cover rounded-lg shadow-lg" />
            </div>
        </section>

        <p class="mb-10 mt-8 text-lg leading-relaxed">
            La cuisine marocaine est réputée dans le monde entier pour sa richesse en
            saveurs et ses plats épicés et raffinés. Héritée des traditions berbères,
            arabes, andalouses et africaines, elle marie harmonieusement douceur,
            acidité, épices et herbes fraîches. Chaque bouchée est un voyage sensoriel.
        </p>

        <!-- Plats emblématiques -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Les plats emblématiques du Maroc</h2>
        <div class="grid md:grid-cols-2 gap-8 mb-12">
            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-mar/couscous-marocain.jpeg" alt="Couscous marocain"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">Le couscous marocain</h3>
                <p>Préparé avec des légumes, pois chiches et viande, servi avec des raisins secs.</p>
            </div>

            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-mar/tajine-poulet-citron.jpeg" alt="Tajine poulet citron"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">Le tajine au citron confit</h3>
                <p>Un classique à base de poulet, citron confit et olives vertes, cuit lentement.</p>
            </div>

            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-mar/pastilla.jpeg" alt="Pastilla au poulet"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">La pastilla</h3>
                <p>Feuilleté sucré-salé à base de volaille, d’amandes et de cannelle, emblème des fêtes.</p>
            </div>

            <div
                class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
                <img src="/src/assets/img/cuisine-mar/harira-marocaine.jpeg" alt="Bol de harira marocaine"
                    class="rounded-2xl shadow w-full h-64 object-cover mb-4" />
                <h3 class="font-bold mt-4 text-primary">La harira</h3>
                <p>Soupe nourrissante à base de tomates, lentilles, pois chiches et viande.</p>
            </div>
        </div>

        <!-- Ingrédients typiques -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Ingrédients et épices phares du Maroc</h2>
        <div class="grid md:grid-cols-2 gap-8 mb-12 items-center">
            <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li class="flex items-start"><span class="text-accent font-bold mr-2">•</span><strong>Ras el
                        hanout</strong> – mélange d’épices marocain</li>
                <li class="flex items-start"><span class="text-accent font-bold mr-2">•</span><strong>Citron
                        confit</strong> – ingrédient phare des tajines</li>
                <li class="flex items-start"><span class="text-accent font-bold mr-2">•</span><strong>Cannelle,
                        gingembre, safran</strong> – pour les plats sucrés-salés</li>
                <li class="flex items-start"><span class="text-accent font-bold mr-2">•</span><strong>Menthe
                        fraîche</strong> – essentielle pour le thé marocain</li>
                <li class="flex items-start"><span class="text-accent font-bold mr-2">•</span><strong>Huile
                        d’olive</strong> – omniprésente</li>
                <li class="flex items-start"><span class="text-accent font-bold mr-2">•</span><strong>Semoule de
                        blé</strong> – base du couscous</li>
                <li class="flex items-start"><span class="text-accent font-bold mr-2">•</span><strong>Miel & fleur
                        d’oranger</strong> – pour les pâtisseries</li>
            </ul>

            <div class="relative">
                <img src="/src/assets/img/cuisine-mar/epices-marocaines.jpeg" alt="Épices marocaines"
                    class="rounded-2xl shadow-lg w-full h-64 object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                <p class="absolute bottom-4 left-4 text-white font-semibold text-lg">Épices marocaines</p>
            </div>
        </div>

        <!-- Histoire et influences -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Un patrimoine culinaire riche et millénaire</h2>
        <p class="mb-12">
            La cuisine marocaine est l’une des plus réputées du monde. Elle reflète
            l’histoire du pays, ses échanges avec les civilisations berbères,
            arabes, andalouses et subsahariennes. Chaque plat est un héritage
            transmis avec soin et fierté à travers les générations.
        </p>

        <!-- Galerie photo -->
        <h2 class="text-2xl font-semibold mb-4 text-primary">Un aperçu en images</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div class="relative group">
                <img src="/src/assets/img/cuisine-mar/couscous-marocain.jpeg" alt="Couscous marocain"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="relative group">
                <img src="/src/assets/img/cuisine-mar/tajine-poulet-citron.jpeg" alt="Tajine marocain"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="relative group">
                <img src="/src/assets/img/cuisine-mar/pastilla.jpeg" alt="Pastilla marocaine"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="relative group">
                <img src="/src/assets/img/cuisine-mar/harira-marocaine.jpeg" alt="Harira"
                    class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
        </div>

        <!-- Call to action -->
        <div class="mb-16">
            <h2 class="text-2xl font-semibold mb-10 text-primary text-center">Envie d’un festin marocain ? </h2>

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
        <h2 class="text-2xl font-semibold mb-4 text-primary">Questions fréquentes sur la cuisine marocaine</h2>
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
        question: "Comment se déroule un repas traditionnel marocain au restaurant ?",
        answer: "Un repas marocain débute souvent par des salades variées, suivi d’un plat principal comme un tajine ou un couscous, puis se termine par un dessert sucré ou un thé à la menthe."
    },
    {
        question: "Le couscous est-il toujours servi le vendredi au Maroc ?",
        answer: "Traditionnellement, le couscous est préparé le vendredi après la prière, mais dans les restaurants, il est proposé toute la semaine."
    },
    {
        question: "Y a-t-il des plats marocains adaptés aux végétariens ?",
        answer: "Oui, de nombreux plats comme les tajines de légumes, les hariras végétariennes ou le couscous aux légumes sont sans viande et très savoureux."
    },
    {
        question: "Quelle est la boisson traditionnelle qui accompagne les repas marocains ?",
        answer: "Le thé à la menthe est la boisson emblématique du Maroc, souvent servi après les repas, mais aussi en signe de bienvenue."
    },
    {
        question: "Quels desserts typiques peut-on goûter dans une cuisine marocaine ?",
        answer: "On retrouve des pâtisseries comme les cornes de gazelle, les briouates au miel, ou encore le sellou et les dattes farcies."
    },
    {
        question: "Pourquoi utilise-t-on autant d'épices dans la cuisine marocaine ?",
        answer: "Les épices comme le curcuma, le cumin, le gingembre et le ras el hanout permettent de créer des plats riches en arômes, sans être forcément piquants."
    }
]

</script>

<style scoped>
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
