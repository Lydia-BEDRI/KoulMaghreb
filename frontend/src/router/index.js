import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import FAQ from '../components/Faq.vue'
import MentionsLegales from '@/components/MentionsLegales.vue'
import CuisineAlgerienne from '@/components/CuisineAlgerienne.vue'
import CuisineMarocaine from '@/components/CuisineMarocaine.vue'


const routes = [
  { path: '/', name: 'Accueil', component: Home },
  { path: '/faq', name: 'FAQ', component: FAQ },
  { path:'/mentions-legales', name: 'Mentions légales', component: MentionsLegales },
  { path:'/cuisine-algerienne', name: 'Cuisine algérienne', component: CuisineAlgerienne },
  { path:'/cuisine-marocaine', name: 'Cuisine marocaine', component: CuisineMarocaine },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
