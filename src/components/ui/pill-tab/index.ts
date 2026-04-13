import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as PillTab } from './PillTab.vue'
export { default as ScrollablePillTabs } from './ScrollablePillTabs.vue'
export type { PillTabItem } from './ScrollablePillTabs.vue'

export const pillTabVariants = cva(
  'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 gap-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  {
    variants: {
      state: {
        // Active with background
        active: 'bg-primary-500 text-white hover:bg-primary-600',
        // Filter active state
        'filter-active':
          'bg-primary-50 text-primary-700 border border-primary-600 hover:bg-primary-100',
        // Default with background
        default:
          'bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50',
        // Default without background (dark mode/no background)
        outline: 'border border-white/20 text-white hover:border-white/40',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

export type PillTabVariants = VariantProps<typeof pillTabVariants>
