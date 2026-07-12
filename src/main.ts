import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { QuillEditor } from '@vueup/vue-quill'

import App from './App.vue'
import router from './router'
import { isAuthPath } from './router/paths'
import { vueQueryOptions, setupViewport } from './plugins'
import { registerSessionExpiredHandler } from './services/http'
import { useAuthStore } from './stores'

import './assets/css/main.css'
import 'vue-sonner/style.css'

setupViewport()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, vueQueryOptions)
app.component('QuillEditor', QuillEditor)

// Must run after `app.use(createPinia())` so the store is accessible.
// Preserves the current path via `?redirect=` for post-login return.
registerSessionExpiredHandler(() => {
  useAuthStore().clearSession()

  const current = router.currentRoute.value
  if (isAuthPath(current.path)) return

  const target: { path: string; query?: Record<string, string> } = { path: '/login' }
  if (current.fullPath && current.fullPath !== '/') {
    target.query = { redirect: current.fullPath }
  }
  router.replace(target)
})

app.mount('#app')
