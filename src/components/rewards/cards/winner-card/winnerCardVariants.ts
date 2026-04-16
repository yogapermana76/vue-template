import { cva, type VariantProps } from 'class-variance-authority'

export const winnerCardVariants = cva(
  'flex flex-col items-start gap-1 w-full rounded-sm overflow-hidden',
  {
    variants: {
      variant: {
        featured: 'bg-primary-500',
        default: 'bg-neutral-100 border border-neutral-200',
        highlighted: 'bg-primary-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const winnerCardHeaderVariants = cva(
  'flex w-full flex-row items-center justify-between px-3 pt-2 pb-1 gap-4',
  {
    variants: {
      variant: {
        featured: '',
        default: '',
        highlighted: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const winnerCardContentVariants = cva(
  'flex w-full flex-row items-center justify-between px-3 py-3 rounded-sm',
  {
    variants: {
      variant: {
        featured: 'bg-white',
        default: 'bg-white',
        highlighted: 'bg-primary-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const winnerCardHeaderTextVariants = cva('w-full truncate', {
  variants: {
    variant: {
      featured: 'body-caption-semibold text-white',
      default: 'body-small-semibold text-slate-600',
      highlighted: 'body-small-semibold text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const winnerCardWinnerNameVariants = cva('body-m-semibold w-full truncate', {
  variants: {
    variant: {
      featured: 'text-slate-950',
      default: 'text-slate-950',
      highlighted: 'text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const winnerCardDetailVariants = cva('body-caption w-full truncate', {
  variants: {
    variant: {
      featured: 'text-slate-500',
      default: 'text-slate-500',
      highlighted: 'text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type WinnerCardVariants = VariantProps<typeof winnerCardVariants>
