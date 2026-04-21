import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { vueQueryOptions, setupViewport, setupAuth } from './plugins'

import './assets/css/main.css'
import 'vue-sonner/style.css'

// Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

setupViewport()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, vueQueryOptions)

// Initialize auth before mounting (restore session + handle new token)
setupAuth()

app.mount('#app')
