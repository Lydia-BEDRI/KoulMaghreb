import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/main/MainLayout.vue'
import AdminLayout from '@/layouts/admin/AdminLayout.vue'
import Home from '@/components/Home.vue'
import FAQ from '@/components/Faq.vue'
import MentionsLegales from '@/components/MentionsLegales.vue'
import CuisineAlgerienne from '@/components/CuisineAlgerienne.vue'
import CuisineMarocaine from '@/components/CuisineMarocaine.vue'
import CuisineTunisienne from '@/components/CuisineTunisienne.vue'
import Contact from '@/components/Contact.vue'
import BlogList from '@/components/BlogList.vue'
import BlogDetail from '@/components/BlogDetail.vue'
import Panier from '@/components/Panier.vue'
import Commandes from '@/components/Commandes.vue'
import NosPlatsCatalogue from '@/components/NosPlatsCatalogue.vue'
import PlatDetail from '@/components/PlatDetail.vue'
import Favoris from '@/components/Favoris.vue'
import EvenementList from '@/components/EvenementList.vue'
import MesReservations from '@/components/MesReservations.vue'
import EvenementDetail from '@/components/EvenementDetail.vue'
import ProfilUtilisateur from '@/components/ProfilUtilisateur.vue'

import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import AdminCommandesTable from '@/components/admin/AdminCommandesTable.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Accueil', component: Home },
      { path: 'faq', name: 'FAQ', component: FAQ },
      { path: 'mentions-legales', name: 'Mentions légales', component: MentionsLegales },
      { path: 'cuisine-algerienne', name: 'Cuisine algérienne', component: CuisineAlgerienne },
      { path: 'cuisine-marocaine', name: 'Cuisine marocaine', component: CuisineMarocaine },
      { path: 'cuisine-tunisienne', name: 'Cuisine tunisienne', component: CuisineTunisienne },
      { path: 'contact', name: 'Contact', component: Contact },
      { path: 'blog', name: 'Blog', component: BlogList },
      { path: 'blog/:slug', name: 'Article', component: BlogDetail },
      { path: 'mon-panier', name: 'Panier', component: Panier },
      { path: 'mes-commandes', name: 'Mes commandes', component: Commandes },
      { path: 'nos-plats', name: 'Nos plats', component: NosPlatsCatalogue },
      { path: 'decouvrir-les-plats', name: 'Découvrir les plats', component: NosPlatsCatalogue },
      { path: 'plat/:id', name: 'Plat', component: PlatDetail },
      { path: 'mes-favoris', name: 'Mes favoris', component: Favoris },
      { path: 'evenements', name: 'Événements', component: EvenementList },
      { path: 'evenement/:id', name: 'Événement Détail', component: EvenementDetail },
      { path: 'mes-reservations', name: 'Mes réservations', component: MesReservations },
      { path: 'profil', name: 'Mon profil', component: ProfilUtilisateur },
    ],
  },

  {
    path: '/admin',
    component: AdminLayout,
    children: [{ path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'commandes', name: 'AdminCommandes', component: AdminCommandesTable },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
