import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const showLoginModal = ref(false)
  const showSignupModal = ref(false)

  function openLogin() {
    showLoginModal.value = true
  }

  function closeLogin() {
    showLoginModal.value = false
  }

  function openSignup() {
    showSignupModal.value = true 
  }

  function closeSignup() {
    showSignupModal.value = false 
  }

  return { showLoginModal, openLogin, closeLogin, showSignupModal, openSignup, closeSignup }
})
