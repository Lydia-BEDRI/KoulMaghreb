import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import FAQ from '../components/Faq.vue'


const routes = [
  { path: '/', name: 'Accueil', component: Home },
  { path: '/faq', name: 'FAQ', component: FAQ },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
