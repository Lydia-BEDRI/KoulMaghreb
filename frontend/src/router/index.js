import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'

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
import AdminReservationsTable from '@/components/admin/AdminReservationsTable.vue'
import AdminUtilisateursTable from '@/components/admin/AdminUtilisateursTable.vue'
import AdminEvenementsTable from '@/components/admin/AdminEvenementsTable.vue'
import AdminAvisTable from '@/components/admin/AdminAvisTable.vue'
import AdminArticlesTable from '@/components/admin/AdminArticlesTable.vue'
import AdminPlatsTable from '@/components/admin/AdminPlatsTable.vue'
import AdminProfil from '@/views/admin/AdminProfil.vue'

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
      { path: 'evenements/:id', name: 'Événement Détail', component: EvenementDetail },
      { path: 'mes-reservations', name: 'Mes réservations', component: MesReservations },
      { path: 'profil', name: 'Mon profil', component: ProfilUtilisateur },
    ],
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: { name: 'AdminDashboard' } },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'commandes', name: 'AdminCommandes', component: AdminCommandesTable },
      { path: 'reservations', name: 'AdminReservations', component: AdminReservationsTable },
      { path: 'utilisateurs', name: 'AdminUtilisateurs', component: AdminUtilisateursTable },
      { path: 'evenements', name: 'AdminEvenements', component: AdminEvenementsTable },
      { path: 'avis', name: 'AdminAvis', component: AdminAvisTable },
      { path: 'articles', name: 'AdminArticles', component: AdminArticlesTable },
      { path: 'plats', name: 'AdminPlats', component: AdminPlatsTable},
      { path: 'profil', name: 'AdminProfil', component: AdminProfil },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const user = authService.getCurrentUser()
  
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!token || !user || user.role !== 'Admin') {
      next('/')
      return
    }
  }
  
  if (token && user && user.role === 'Admin' && to.path === '/' && from.path !== '/admin/dashboard') {
    next('/admin/dashboard')
    return
  }
  
  const protectedRoutes = ['/profil', '/mes-commandes', '/mes-favoris', '/mes-reservations', '/mon-panier']
  if (protectedRoutes.includes(to.path) && !token) {
    next('/')
    return
  }
  
  next()
})

export default router
