import { cva, type VariantProps } from 'class-variance-authority'

export const winnerCardVariants = cva(
  'flex flex-col items-start gap-1 w-full rounded-sm overflow-hidden',
  {
    variants: {
      variant: {
        featured: 'bg-primary-500',
        default: 'bg-slate-100 border border-slate-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const winnerCardHeaderTextVariants = cva('', {
  variants: {
    variant: {
      featured: 'body-caption-semibold text-white',
      default: 'body-small-semibold text-slate-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type WinnerCardVariants = VariantProps<typeof winnerCardVariants>
