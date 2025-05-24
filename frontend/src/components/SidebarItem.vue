<template>
 <button
  :class="[
    'flex items-center gap-3 px-4 py-2 rounded-lg border font-medium transition',
    active
      ? 'bg-primary text-white shadow border-primary hover:border-accent hover:bg-accent hover:text-white'
      : 'bg-white text-accent border-accent hover:bg-accent hover:text-white'
  ]"
>
    <component :is="iconComponent" class="w-5 h-5" />
    <span>{{ label }}</span>
  </button>
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
} from '@heroicons/vue/24/outline'

const props = defineProps({
  icon: String,
  label: String,
  active: Boolean
})

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
}

const iconComponent = iconMap[props.icon] || HomeIcon
</script>
