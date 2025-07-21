import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import router from './router'

import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { createHead } from '@vueuse/head'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: false,
  toastClassName: 'rounded-xl bg-primary text-white shadow-md px-5 py-3', // Style personnalisé
  bodyClassName: 'font-semibold',
})
const head = createHead()
app.use(head)
app.mount('#app')
