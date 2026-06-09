import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { QuillEditor } from '@vueup/vue-quill'

import App from './App.vue'
import router from './router'
import { vueQueryOptions, setupViewport } from './plugins'

import './assets/css/main.css'
import 'vue-sonner/style.css'

setupViewport()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, vueQueryOptions)
app.component('QuillEditor', QuillEditor)

app.mount('#app')
