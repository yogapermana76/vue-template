import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-500 text-white [a&]:hover:bg-primary-600',
        secondary: 'border-transparent bg-secondary-500 text-white [a&]:hover:bg-secondary-600',
        destructive:
          'border-transparent bg-red-600 text-white [a&]:hover:bg-red-700 focus-visible:ring-red-600/20 dark:focus-visible:ring-red-600/40 dark:bg-red-600',
        outline:
          'text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>

export { default as StockBadge } from './StockBadge.vue'
export type { StockBadgeVariant, StockBadgeIcon } from './StockBadge.vue'
