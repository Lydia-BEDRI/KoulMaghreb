<template>
  <div class="px-4 md:px-4 py-12 text-gray-800">
    <!-- Bannière -->
    <section
      class="bg-primary text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row items-center md:items-stretch justify-between"
    >
      <div class="p-6 sm:p-8 md:p-10 w-full md:w-2/3 flex flex-col justify-center">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
          Découvrez les délices épicés de la cuisine tunisienne
        </h2>
      </div>
      <div
        class="w-full md:w-1/3 flex justify-center md:justify-end items-end bg-primary py-4 md:py-6 pr-0 md:pr-6"
      >
        <img
          src="/src/assets/img/cuisine-tun/cuisine-tunisienne-ban.jpeg"
          alt="Cuisine tunisienne"
          class="w-40 h-28 sm:w-52 sm:h-36 md:w-60 md:h-40 object-cover rounded-lg shadow-lg"
        />
      </div>
    </section>

    <p class="mb-10 mt-8 text-lg leading-relaxed">
      La cuisine tunisienne est une explosion de saveurs méditerranéennes et orientales. Connue pour son utilisation généreuse des épices, de l'huile d'olive et du harissa, elle reflète un métissage culturel entre tradition berbère, influences arabes, turques et italiennes.
    </p>

    <!-- Plats emblématiques -->
    <h2 class="text-2xl font-semibold mb-4 text-primary">Les plats emblématiques de Tunisie</h2>
    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
        <img
          src="/src/assets/img/cuisine-tun/couscous-tunisien.jpeg"
          alt="Couscous tunisien"
          class="rounded-2xl shadow w-full h-64 object-cover mb-4"
        />
        <h3 class="font-bold mt-4 text-primary">Le couscous tunisien</h3>
        <p>Variante épicée du couscous, souvent cuisinée avec de la viande, du poisson ou des légumes.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
        <img
          src="/src/assets/img/cuisine-tun/brik-oeuf.jpeg"
          alt="Brik à l'œuf"
          class="rounded-2xl shadow w-full h-64 object-cover mb-4"
        />
        <h3 class="font-bold mt-4 text-primary">La brik à l'œuf</h3>
        <p>Feuille de malsouka frite contenant un œuf, du thon, parfois des câpres ou du persil.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
        <img
          src="/src/assets/img/cuisine-tun/lablabi.jpeg"
          alt="Lablabi tunisien"
          class="rounded-2xl shadow w-full h-64 object-cover mb-4"
        />
        <h3 class="font-bold mt-4 text-primary">Le lablabi</h3>
        <p>Soupe chaude de pois chiches, assaisonnée avec de l’harissa, du cumin et de l’ail, souvent servie sur du pain rassis.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition hover:-translate-y-1 flex flex-col items-center">
        <img
          src="/src/assets/img/cuisine-tun/makroudh.jpeg"
          alt="Makroudh tunisien"
          class="rounded-2xl shadow w-full h-64 object-cover mb-4"
        />
        <h3 class="font-bold mt-4 text-primary">Le makroudh</h3>
        <p>Gâteau à base de semoule farci de pâte de dattes, frit et nappé de miel ou sirop parfumé.</p>
      </div>
    </div>

    <!-- Ingrédients typiques -->
    <h2 class="text-2xl font-semibold mb-4 text-primary">Ingrédients et épices phares de Tunisie</h2>
    <div class="grid md:grid-cols-2 gap-8 mb-12 items-center">
      <ul class="list-disc list-inside space-y-2 text-gray-700">
        <li><strong>Harissa</strong> – purée de piment rouge, emblème de la cuisine tunisienne</li>
        <li><strong>Thon en conserve</strong> – souvent utilisé dans les salades et les bricks</li>
        <li><strong>Olives noires et vertes</strong> – toujours présentes sur la table</li>
        <li><strong>Câpres</strong> – apportent du peps aux plats et entrées</li>
        <li><strong>Cumin, carvi, coriandre</strong> – épices courantes dans les soupes et ragoûts</li>
        <li><strong>Semoule</strong> – base des couscous et makroudh</li>
        <li><strong>Menthe sèche</strong> – utilisée dans le thé ou certaines sauces</li>
      </ul>

      <div class="relative">
        <img
          src="/src/assets/img/cuisine-tun/epices-tunisiennes.jpeg"
          alt="Épices tunisiennes"
          class="rounded-2xl shadow-lg w-full h-64 object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
        <p class="absolute bottom-4 left-4 text-white font-semibold text-lg">Épices tunisiennes</p>
      </div>
    </div>

    <!-- Histoire et influences -->
    <h2 class="text-2xl font-semibold mb-4 text-primary">Une cuisine aux multiples influences</h2>
    <p class="mb-12">
      La cuisine tunisienne reflète un carrefour culturel entre les rives méditerranéennes et les influences orientales. Le passage des civilisations phéniciennes, romaines, arabes et ottomanes a laissé une empreinte riche sur les recettes locales, créant une gastronomie à la fois unique et variée.
    </p>

    <!-- Galerie photo -->
    <h2 class="text-2xl font-semibold mb-4 text-primary">Un aperçu en images</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <div class="relative group">
        <img
          src="/src/assets/img/cuisine-tun/couscous-tunisien.jpeg"
          alt="Couscous tunisien"
          class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div class="relative group">
        <img
          src="/src/assets/img/cuisine-tun/brik-oeuf.jpeg"
          alt="Brik à l'œuf"
          class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div class="relative group">
        <img
          src="/src/assets/img/cuisine-tun/lablabi.jpeg"
          alt="Lablabi"
          class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div class="relative group">
        <img
          src="/src/assets/img/cuisine-tun/makroudh.jpeg"
          alt="Makroudh"
          class="rounded-xl w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>

    <!-- Call to action -->
        <div class="mb-16">
            <h2 class="text-2xl font-semibold mb-10 text-primary text-center">Prêt·e à savourer les délices de la Tunisie ? </h2>

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
import { useSeo } from '@/composables/useSeo.js'

useSeo({
  title: 'Cuisine tunisienne : recettes, plats et spécialités - KoulMaghreb',
  description: "Découvrez les saveurs épicées et les plats emblématiques de la cuisine tunisienne : couscous, brik à l'œuf, lablabi, makroudh et bien plus sur KoulMaghreb."
})

const openIndex = ref(null)

const toggle = (index) => {
    openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: "Quelle est la différence entre le couscous tunisien et le couscous marocain ou algérien ?",
    answer: "Le couscous tunisien est souvent plus épicé, préparé avec de l’harissa, et accompagné de poisson ou de boulettes de viande, alors que dans les autres pays du Maghreb, il est généralement moins piquant et préparé avec d’autres types de viande comme l’agneau."
  },
  {
    question: "Qu’est-ce que le kafteji et comment se mange-t-il ?",
    answer: "Le kafteji est un mélange de légumes frits (poivrons, tomates, courgettes, pommes de terre), souvent accompagné d’œufs et de foie, le tout haché grossièrement et servi avec du pain. C’est un plat populaire, souvent vendu dans les snacks."
  },
  {
    question: "L’harissa est-elle utilisée dans tous les plats tunisiens ?",
    answer: "L’harissa est un ingrédient central dans la cuisine tunisienne, mais elle n’est pas systématiquement présente dans tous les plats. Elle peut être servie à part pour ceux qui veulent relever leur plat selon leur goût."
  },
  {
    question: "Peut-on goûter des plats typiques tunisiens dans la rue ?",
    answer: "Oui, la street food tunisienne est très développée. On y trouve des briks, des fricassés (sandwichs frits), des kaftejis, ou encore des mlawis (crêpes garnies)."
  },
  {
    question: "Pourquoi les Tunisiens mangent-ils autant de thon en boîte ?",
    answer: "Le thon en boîte est très utilisé en Tunisie, notamment dans les briks, les salades, ou les sandwichs. C’est une habitude culinaire bien ancrée qui permet d'ajouter facilement une source de protéine à un plat."
  },
  {
    question: "C’est quoi exactement la ojja tunisienne ?",
    answer: "La ojja est une poêlée de tomates, d’harissa et d’épices dans laquelle on casse des œufs en fin de cuisson. Elle peut être enrichie de merguez, de fruits de mer ou simplement rester végétarienne."
  },
  {
    question: "Est-ce que la cuisine tunisienne est adaptée aux enfants ou aux personnes sensibles au piment ?",
    answer: "Beaucoup de plats peuvent être adaptés en réduisant la quantité d’harissa ou en la servant à part. Il existe aussi des plats doux comme le couscous aux légumes ou le riz djerbien qui conviennent très bien aux enfants."
  },
  {
    question: "Quel est le pain le plus consommé en Tunisie ?",
    answer: "Le khobz tabouna est un pain cuit dans un four traditionnel en terre, très populaire en Tunisie. On consomme aussi beaucoup de baguette, héritage de la période française."
  },
  {
    question: "Quels desserts tunisiens sont incontournables pendant le Ramadan ?",
    answer: "Pendant le Ramadan, les Tunisiens consomment souvent de la zlebia et du makroudh, deux desserts sucrés et riches, ainsi que de la bouza (crème de noisettes) ou des dattes farcies."
  },
  {
    question: "Y a-t-il des spécialités culinaires propres au sud ou au nord de la Tunisie ?",
    answer: "Oui, chaque région a ses propres spécialités. Par exemple, le riz djerbien vient du sud, la charmoula est populaire à Sfax, et le poisson est omniprésent dans les villes côtières comme Bizerte ou Mahdia."
  }
];


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