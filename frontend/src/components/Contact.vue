<template>
  <main class="px-4 py-8 space-y-16 bg-background">
    <section>
      <div class="container mx-auto px-6 md:px-12">
        <h1 class="text-4xl font-bold text-center mb-4 text-primary">Contactez-nous</h1>
        <p class="text-center text-gray-800 mb-12 text-lg">
          Une question, une remarque ? Écrivez-nous ou venez nous rencontrer.
        </p>

        <div class="grid md:grid-cols-2 gap-12 items-stretch">
          <div class="flex flex-col h-full">
            <h3 class="text-2xl font-semibold mb-4 text-accent">Nos coordonnées</h3>
            <p class="text-gray-600 mb-6">N'hésitez pas à nous contacter ou à visiter notre restaurant.</p>

            <div class="space-y-6">
                <div class="flex items-start gap-4">
                <MapPinIcon class="w-7 h-7 text-orange-500 flex-shrink-0" />
                <p class="text-gray-700 font-medium">
                  <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Rue+des+Saveurs,+75000+Paris,+France"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-orange-600 hover:underline"
                  >
                  123 Rue des Saveurs, 75000 Paris, France
                  </a>
                </p>
                </div>
              <div class="flex items-start gap-4">
                <EnvelopeIcon class="w-7 h-7 text-orange-500 flex-shrink-0" />
                <p>
                  <a href="mailto:contact@koulmaghreb.fr" class="text-orange-600 hover:underline font-medium">
                    contact@koulmaghreb.fr
                  </a>
                </p>
              </div>
              <div class="flex items-start gap-4">
                <PhoneIcon class="w-7 h-7 text-orange-500 flex-shrink-0" />
                <p>
                  <a href="tel:+33123456789" class="text-orange-600 hover:underline font-medium">
                    +33 1 23 45 67 89
                  </a>
                </p>
              </div>
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h4 class="font-semibold mb-1 text-gray-800">Nos horaires :</h4>
                <p class="text-gray-600">Lundi - Vendredi : <span class="font-medium text-gray-800">11h00 - 22h00</span>
                </p>
                <p class="text-gray-600">Samedi - Dimanche : <span class="font-medium text-gray-800">10h00 -
                    23h00</span></p>
              </div>
            </div>

            <div class="mt-6">
              <h4 class="font-semibold mb-2">Suivez-nous :</h4>
              <div class="flex space-x-4 text-orange-500 text-2xl">
                <a href="#" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 rounded-sm" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24H12.82V14.708h-3.29v-3.622h3.29V8.413c0-3.262 1.993-5.043 4.904-5.043 1.393 0 2.59.104 2.938.15v3.404l-2.017.001c-1.58 0-1.886.752-1.886 1.852v2.428h3.77l-.491 3.622h-3.279V24h6.426c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.406 0 22.675 0z" />
                  </svg>
                </a>

                <a href="#" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75a3.25 3.25 0 013.25-3.25h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.25-.75a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                  </svg>
                </a>

                <a href="#" aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12.75 2h3.25a4.75 4.75 0 004.75 4.75v3.25a7.98 7.98 0 01-4.75-1.6v7.77a6.25 6.25 0 11-6.25-6.25c.17 0 .34.01.5.03v3.28a2.75 2.75 0 102.75 2.75V2z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          <!-- Formulaire -->
            <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold mb-4 text-accent text-center">Envoyez-nous un message</h3>
            <form action="#" method="POST" class="space-y-4">
              <input type="text" placeholder="Nom" class="w-full px-4 py-2 border rounded-lg" required>
              <input type="email" placeholder="Adresse e-mail" class="w-full px-4 py-2 border rounded-lg" required>
              <textarea placeholder="Message" class="w-full px-4 py-2 border rounded-lg h-32" required></textarea>
              <div class="flex justify-center">
              <button type="submit" class="bg-accent text-white px-6 py-2 rounded-lg hover:bg-primary">Envoyer</button>
              </div>
            </form>
            </div>
        </div>

        <!-- Carte -->
        <div class="mt-16 border-2 border-primary rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154846816!3d37.77492977975962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0e2c5b1%3A0x4c8b8b8b8b8b8b8b!2sRestaurant!5e0!3m2!1sen!2sfr!4v1680000000000!5m2!1sen!2sfr"
            width="100%" height="400" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            class="rounded-lg shadow-md">
          </iframe>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/vue/24/outline'
import { useSeo } from '@/composables/useSeo.js'

useSeo({
  title: 'Contactez-nous - KoulMaghreb',
  description: "Besoin d’un renseignement ou d’une réservation ? Retrouvez toutes les coordonnées et le formulaire de contact du restaurant KoulMaghreb."
})
</script>

<style scoped></style>