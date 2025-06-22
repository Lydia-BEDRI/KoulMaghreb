<template>
  <router-link
    :to="to"
    class="flex items-center gap-3 px-4 py-2 rounded-lg border font-medium transition"
    :class="activeClasses"
  >
    <component :is="iconComponent" class="w-5 h-5" />
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup>
import {
  HomeIcon,
  FireIcon,
  StarIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  NewspaperIcon,
  DocumentTextIcon,
  ListBulletIcon,
  HeartIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  TicketIcon,
} from '@heroicons/vue/24/outline' // Ajout des icônes manquantes

import { computed } from 'vue'

const props = defineProps({
  icon: String,
  label: String,
  to: String,
})

import { useRoute } from 'vue-router'
const route = useRoute()

const iconMap = {
  home: HomeIcon,
  fire: FireIcon,
  star: StarIcon,
  globe: GlobeAltIcon,
  'globe-alt': GlobeAltIcon,
  'question-mark-circle': QuestionMarkCircleIcon,
  'chat-bubble-left-ellipsis': ChatBubbleLeftEllipsisIcon,
  newspaper: NewspaperIcon,
  'document-text': DocumentTextIcon,
  'list-bullet': ListBulletIcon,
  heart: HeartIcon,
  'shopping-cart': ShoppingCartIcon,
  'archive-box': ArchiveBoxIcon,
  'calendar-days': CalendarDaysIcon,
  ticket: TicketIcon,
}

const iconComponent = iconMap[props.icon] || HomeIcon

const activeClasses = computed(() => {
  const isActive =
    route.path === props.to ||
    route.path.startsWith(props.to + '/') || // Actif pour les sous-pages
    (props.to === '/decouvrir-les-plats' && route.path.startsWith('/plat')) ||
    (props.to === '/nos-plats' && route.path.startsWith('/plat')) 
  return isActive
    ? 'bg-primary text-white shadow border-primary hover:border-accent hover:bg-accent hover:text-white'
    : 'bg-white text-accent border-accent hover:bg-accent hover:text-white'
})
</script>
