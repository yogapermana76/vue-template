import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const searchInputVariants = cva('', {
  variants: {
    variant: {
      default: '',
      glass: '',
    },
    disabled: {
      true: '',
      false: '',
    },
    element: {
      container: '',
      icon: '',
      input: '',
      button: '',
    },
  },
  compoundVariants: [
    // Container - Default variant
    {
      variant: 'default',
      disabled: false,
      element: 'container',
      class: 'border border-slate-200 bg-white',
    },
    {
      variant: 'default',
      disabled: true,
      element: 'container',
      class: 'border-0 bg-slate-100',
    },

    // Container - Glass variant
    {
      variant: 'glass',
      element: 'container',
      class: 'border border-white/40 bg-white/5 backdrop-blur-[11px]',
    },

    // Icon - Default variant
    {
      variant: 'default',
      element: 'icon',
      class: 'size-4 text-slate-500',
    },

    // Icon - Glass variant
    {
      variant: 'glass',
      element: 'icon',
      class: 'size-4 text-lemon-200',
    },

    // Input - Default variant
    {
      variant: 'default',
      disabled: false,
      element: 'input',
      class: 'text-sm text-slate-950 placeholder:text-slate-400',
    },
    {
      variant: 'default',
      disabled: true,
      element: 'input',
      class: 'text-sm text-slate-500 placeholder:text-slate-500',
    },

    // Input - Glass variant
    {
      variant: 'glass',
      element: 'input',
      class: 'body-caption text-white placeholder:text-white/75',
    },

    // Button - Default variant
    {
      variant: 'default',
      element: 'button',
      class:
        'flex shrink-0 items-center justify-center text-slate-500 hover:text-slate-700 disabled:opacity-50',
    },

    // Button - Glass variant
    {
      variant: 'glass',
      element: 'button',
      class:
        'flex shrink-0 items-center justify-center text-white/75 hover:text-white disabled:opacity-50',
    },
  ],
  defaultVariants: {
    variant: 'default',
    disabled: false,
    element: 'container',
  },
})

export type SearchInputVariants = VariantProps<typeof searchInputVariants>
