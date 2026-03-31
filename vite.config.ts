import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // File-based routing (MUST be before vue())
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/types/typed-router.d.ts',
    }),

    vue(),
    tailwindcss(),

    // Auto import APIs
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': [
            'useStorage',
            'useDark',
            'useMediaQuery',
            'reactiveOmit',
            'useVModel',
            'useIntersectionObserver',
          ],
        },
        {
          '@tanstack/vue-query': [
            'useQuery',
            'useInfiniteQuery',
            'useMutation',
            'useQueryClient',
            'keepPreviousData',
          ],
        },
        // Import from barrel files only
        {
          '@/composables': [
            'useAuth',
            'useAuthState',
            'useAuthActions',
            'useAuthLoading',
            'useToast',
          ],
          '@/composables/services': [
            'useProducts',
            'useProduct',
            'useProductsInfinite',
            'useProductCategories',
            'productKeys',
          ],
          '@/stores': ['useThemeStore'],
          '@/utils': [
            'cn',
            'formatCurrency',
            'formatNumber',
            'formatDate',
            'formatRelativeDate',
            'getErrorMessage',
          ],
        },
      ],
      // No dirs - use explicit imports above to avoid duplicates
      vueTemplate: true,
      dts: 'src/types/auto-imports.d.ts',
    }),

    // Auto import components
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/types/components.d.ts',
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Build optimization
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 500,
  },

  // Server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
  },

  // Preview configuration
  preview: {
    port: 4173,
    host: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@vueuse/core',
      '@tanstack/vue-query',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'reka-ui',
      'lucide-vue-next',
      'date-fns',
    ],
  },
})
