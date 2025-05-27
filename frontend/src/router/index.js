import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import FAQ from '../components/Faq.vue'
import MentionsLegales from '@/components/MentionsLegales.vue'


const routes = [
  { path: '/', name: 'Accueil', component: Home },
  { path: '/faq', name: 'FAQ', component: FAQ },
  { path:'/mentions-legales', name: 'Mentions légales', component: MentionsLegales },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
