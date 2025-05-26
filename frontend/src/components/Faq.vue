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
      <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
        <svg class="w-10 h-10 text-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 0v13m0-13c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-primary mb-2">Méthodes de paiement</h3>
        <p class="text-gray-600 text-sm">Découvrez les moyens de paiement acceptés pour vos commandes.</p>
      </div>
      <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
        <svg class="w-10 h-10 text-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h11M9 21V3m0 18l-6-6m6 6l6-6"></path>
        </svg>
        <h3 class="text-lg font-semibold text-primary mb-2">Zones de livraison</h3>
        <p class="text-gray-600 text-sm">Consultez les zones où nous livrons actuellement.</p>
      </div>
      <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
        <svg class="w-10 h-10 text-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6m-7 4h14m-7-7a7 7 0 100-14 7 7 0 000 14z"></path>
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
        class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200"
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
