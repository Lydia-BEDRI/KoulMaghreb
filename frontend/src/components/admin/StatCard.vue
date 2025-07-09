<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  title: String,
  value: [String, Number],
  icon: String 
})
</script>

<template>
  <div class="flex items-center justify-between bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
    <div>
      <div class="text-2xl font-bold text-gray-800">{{ value }}</div>
      <div class="text-sm text-gray-500">{{ title }}</div>
    </div>
    <Icon :icon="icon" class="w-8 h-8 text-primary" />
  </div>
</template>
