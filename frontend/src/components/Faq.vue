<template>
  <section class="py-12 px-4 md:px-16">
    <h2 class="text-3xl font-bold text-primary mb-8 text-center">
      Foire Aux Questions
    </h2>
    <p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">
      Retrouvez ici les réponses aux questions les plus fréquemment posées par nos clients. Si vous ne trouvez pas votre réponse, n'hésitez pas à nous contacter directement.
    </p>

    <!-- Résumé des questions sous forme de cards -->
    <div class="grid md:grid-cols-3 gap-6 mb-12">
      <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg hover:-translate-y-1">
        <!-- Icône Carte Bancaire -->
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" class="text-accent mb-4">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M22 10v6a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-6h20zm-14.99 4h-.01a1 1 0 1 0 .01 2a1 1 0 0 0 0 -2zm5.99 0h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0 -2zm5 -10a4 4 0 0 1 4 4h-20a4 4 0 0 1 4 -4h12z" />
        </svg>
        <h3 class="text-lg font-semibold text-primary mb-2">Méthodes de paiement</h3>
        <p class="text-gray-600 text-sm">Découvrez les moyens de paiement acceptés pour vos commandes.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg hover:-translate-y-1">
        <!-- Icône Localisation -->
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" class="text-accent mb-4">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0 0 1 -1.409 .903a1.547 1.547 0 0 1 -1.329 -.747l-.065 -.127l-3.352 -6.702l-6.67 -3.336a1.55 1.55 0 0 1 -.898 -1.259l-.006 -.149c0 -.56 .301 -1.072 .841 -1.37l.14 -.07l18.017 -6.506l.106 -.03l.108 -.018z" />
        </svg>
        <h3 class="text-lg font-semibold text-primary mb-2">Zones de livraison</h3>
        <p class="text-gray-600 text-sm">Consultez les zones où nous livrons actuellement.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg hover:-translate-y-1">
        <!-- Icône Heure / Délais -->
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" class="text-accent mb-4">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 2.66a1 1 0 0 0 -1 1v5.026l.009 .105l.02 .107l.04 .129l.048 .102l.046 .078l.042 .06l.069 .08l.088 .083l.083 .062l3 2a1 1 0 1 0 1.11 -1.664l-2.555 -1.704v-4.464a1 1 0 0 0 -.883 -.993z" />
        </svg>
        <h3 class="text-lg font-semibold text-primary mb-2">Délais de livraison</h3>
        <p class="text-gray-600 text-sm">Apprenez-en plus sur nos délais de livraison estimés.</p>
      </div>
    </div>

    <!-- Liste des questions -->
    <div class="max-w-3xl mx-auto space-y-6">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition hover:shadow-lg hover:-translate-y-1"
      >
        <button
          @click="toggle(index)"
          class="w-full flex justify-between items-center p-5 text-left text-primary font-semibold hover:bg-gray-100 transition"
        >
          <span class="text-lg">{{ item.question }}</span>
          <svg
            :class="openIndex === index ? 'rotate-180 text-accent' : 'text-gray-400'"
            class="w-6 h-6 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <transition name="faq-slide">
          <div
            v-if="openIndex === index"
            class="px-5 pb-5 text-gray-600 text-base leading-relaxed"
          >
            {{ item.answer }}
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useSeo } from '@/composables/useSeo.js'

useSeo({
  title: 'FAQ - Questions fréquentes - KoulMaghreb',
  description: "Consultez les réponses aux questions les plus fréquentes sur la cuisine maghrébine, la livraison, les commandes et le service KoulMaghreb."
})

const openIndex = ref(null)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: "Comment passer une commande ?",
    answer:
      "C’est très simple ! Parcourez notre menu, ajoutez les plats à votre panier, puis validez votre commande en quelques clics."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les paiements par carte bancaire, Apple Pay, Google Pay et certains tickets restaurant."
  },
  {
    question: "Puis-je modifier ou annuler ma commande ?",
    answer:
      "Oui, si la commande n’a pas encore été préparée. Contactez-nous rapidement après avoir commandé."
  },
  {
    question: "Quelles sont vos zones de livraison ?",
    answer:
      "Nous livrons actuellement dans Paris uniquement, depuis notre restaurant situé au 123 Rue des Saveurs, 75000 Paris."
  },
  {
    question: "Quels sont les frais de livraison ?",
    answer:
      "Les frais de livraison varient selon la distance. Ils seront affichés lors de la validation de votre commande."
  },
  {
    question: "Quels sont les délais de livraison estimés ?",
    answer:
      "En moyenne, les livraisons prennent entre 30 et 45 minutes. Cela peut varier selon l’affluence."
  },
  {
    question: "Tous vos plats sont-ils halal ?",
    answer:
      "Oui, tous nos plats sont 100% halal. Nous y tenons particulièrement ❤️"
  },
  {
    question: "Que faire en cas de problème technique ?",
    answer:
      "Une page ne s'affiche pas correctement ? Une commande bloque ? Contactez notre équipe via le chat ou l’e-mail de support."
  }
]
</script>

<style scoped>
/* Transition pour le dépliage des réponses */
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

/* Espacement et style des réponses */
div[open] {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
