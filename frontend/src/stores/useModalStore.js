import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const showLoginModal = ref(false)

  function openLogin() {
    showLoginModal.value = true
  }

  function closeLogin() {
    showLoginModal.value = false
  }

  return { showLoginModal, openLogin, closeLogin }
})
