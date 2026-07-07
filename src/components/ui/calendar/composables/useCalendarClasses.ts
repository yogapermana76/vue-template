import { cn } from '@/utils/cn'

// Shared base classes for all cell triggers
export const baseCellClass = cn(
  'relative flex h-10 w-10 items-center justify-center rounded-full text-base transition-all outline-none mx-auto',
  // Selected — filled primary
  'data-selected:bg-primary-600 data-selected:hover:bg-primary-700 data-selected:text-white data-selected:shadow-sm',
  // Today — ring indicator; overridden to white text when also selected
  'data-today:font-semibold data-today:ring-2 data-today:ring-primary-400 data-today:ring-offset-1',
  'data-selected:data-today:ring-0 data-selected:data-today:ring-offset-0 data-selected:data-today:text-white',
)

// Extra classes applied only to holiday cells
export const holidayCellClass = cn(
  'text-sm text-red-400 bg-red-50 ring-1 ring-inset ring-red-200',
  'hover:bg-red-100',
  'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1',
  // Today holiday — ring primary overrides ring-red
  'data-today:ring-primary-400 data-today:ring-offset-1',
  // Outside view — muted red
  'data-outside-view:bg-red-50/40 data-outside-view:text-red-200 data-outside-view:ring-red-100 data-outside-view:hover:bg-red-50/40',
  // Disabled — keep red tint fully visible, only block interaction
  'data-disabled:cursor-not-allowed data-disabled:pointer-events-none',
  // Unavailable — strikethrough only
  'data-unavailable:cursor-not-allowed data-unavailable:pointer-events-none data-unavailable:line-through',
)

// Extra classes applied only to normal cells
export const normalCellClass = cn(
  'text-neutral-900 hover:bg-neutral-100',
  'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-1',
  // Today — tinted text to match the ring
  'data-today:text-primary-600',
  // Outside view — nearly invisible, no interaction
  'data-outside-view:text-neutral-200 data-outside-view:hover:bg-transparent data-outside-view:ring-0',
  // Disabled (holiday or out-of-range) — muted grey, line-through
  'data-disabled:pointer-events-none data-disabled:text-neutral-300 data-disabled:line-through data-disabled:decoration-neutral-200 data-disabled:opacity-60',
  // Unavailable (venue closed / active: false) — amber tint to signal "closed, not a holiday"
  'data-unavailable:pointer-events-none data-unavailable:bg-amber-50 data-unavailable:text-amber-400 data-unavailable:ring-1 data-unavailable:ring-inset data-unavailable:ring-amber-200',
)

export const navButtonClasses = cn(
  'inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 outline-none',
  'border border-primary-600/50 text-primary-700 bg-transparent',
  'hover:border-primary-600',
  'active:bg-primary-600 active:text-white active:border-primary-600',
  'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  'disabled:bg-slate-100 disabled:text-slate-500 disabled:border-transparent disabled:cursor-not-allowed',
)

export const pickerCellTriggerClass = cn(
  'flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all outline-none cursor-pointer',
  'text-neutral-900 hover:bg-neutral-100',
  'data-selected:bg-primary-600 data-selected:text-white data-selected:hover:bg-primary-700',
  'data-today:ring-2 data-today:ring-primary-400 data-today:ring-offset-1',
  'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
  'data-disabled:pointer-events-none data-disabled:text-neutral-300 data-disabled:opacity-60',
)

export function cellClass(isHoliday: boolean): string {
  return cn(baseCellClass, isHoliday ? holidayCellClass : normalCellClass)
}
