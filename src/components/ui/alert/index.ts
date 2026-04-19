import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertBox } from './AlertBox.vue'
export { default as AlertBoxSkeleton } from './AlertBoxSkeleton.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva(
  'relative w-full rounded-sm px-3 py-2 flex flex-row items-start gap-3',
  {
    variants: {
      variant: {
        info: 'bg-sky-50 text-sky-700 [&_[data-slot=alert-icon]]:text-sky-700',
        success: 'bg-green-50 text-green-900 [&_[data-slot=alert-icon]]:text-green-800',
        warning: 'bg-yellow-50 text-yellow-700 [&_[data-slot=alert-icon]]:text-yellow-700',
        error: 'bg-red-50 text-red-700 [&_[data-slot=alert-icon]]:text-red-700',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

export type AlertVariants = VariantProps<typeof alertVariants>
export type AlertVariant = 'info' | 'success' | 'warning' | 'error'
