import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'
export { default as IconButton } from './IconButton.vue'
export { default as FloatingScanButton } from './FloatingScanButton.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:shrink-0 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-transparent disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-600 active:text-white',
        secondary:
          'border border-primary-600/50 text-primary-700 bg-transparent hover:border-primary-600 active:bg-primary-600 active:text-white active:border-primary-600',
        tertiary:
          'text-primary-700 bg-transparent hover:bg-primary-50 active:bg-primary-100 active:text-primary-800',
      },

      size: {
        lg: 'h-12 px-8 text-base leading-6 gap-2',
        md: 'h-10 px-6 text-sm leading-5 gap-2',
        sm: 'h-10 px-6 text-sm leading-5 gap-2',
        xs: 'h-8 px-4 text-xs leading-4.5 gap-1.5',
      },

      layout: {
        iconOnly: '',
        iconLeft: 'flex-row',
        iconRight: 'flex-row-reverse',
      },

      isDarkBg: {
        false: '',
        true: '',
      },
    },

    compoundVariants: [
      // Icon sizing for buttons with text + icon
      { size: 'lg', layout: ['iconLeft', 'iconRight'], class: '[&_svg]:size-5' },
      { size: 'md', layout: ['iconLeft', 'iconRight'], class: '[&_svg]:size-4' },
      { size: 'sm', layout: ['iconLeft', 'iconRight'], class: '[&_svg]:size-4' },
      { size: 'xs', layout: ['iconLeft', 'iconRight'], class: '[&_svg]:size-3.5' },

      // Icon sizing for icon-only buttons
      { size: 'lg', layout: 'iconOnly', class: 'px-0 w-12 h-12 [&_svg]:size-5' },
      { size: 'md', layout: 'iconOnly', class: 'px-0 w-10 h-10 [&_svg]:size-4' },
      { size: 'sm', layout: 'iconOnly', class: 'px-0 w-10 h-10 [&_svg]:size-4' },
      { size: 'xs', layout: 'iconOnly', class: 'px-0 w-8 h-8 [&_svg]:size-3.5' },

      // Dark background variations
      {
        variant: 'primary',
        isDarkBg: true,
        class: 'bg-white text-teal-700 hover:bg-slate-50 active:bg-teal-500 active:text-white',
      },
      {
        variant: 'secondary',
        isDarkBg: true,
        class:
          'border-white/20 text-white bg-transparent hover:border-white/40 active:bg-teal-500 active:text-white active:border-teal-500',
      },
      {
        variant: 'tertiary',
        isDarkBg: true,
        class: 'text-white hover:bg-white/10 active:bg-white/20 active:text-white',
      },
    ],

    defaultVariants: {
      variant: 'primary',
      size: 'md',
      layout: 'iconLeft',
      isDarkBg: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
