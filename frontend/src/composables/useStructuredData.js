import { useHead } from '@vueuse/head'

export function useStructuredData(schemaObject) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(schemaObject)
      }
    ]
  })
}
