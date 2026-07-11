import type { ComboboxOption } from '@/components/ui/combobox/types'

/**
 * Prepend an "All" (reset) option to a list of select options.
 *
 * Useful for table toolbar filters where a select needs to represent
 * "no filter applied" as its default value.
 *
 * @example
 * withAllOption(productCategoryOptions, 'All categories')
 * // → [{ value: 'all', label: 'All categories' }, ...productCategoryOptions]
 */
export function withAllOption<V extends string | number>(
  options: ComboboxOption<V>[],
  label = 'All',
  value: V = 'all' as V,
): ComboboxOption<V>[] {
  return [{ value, label }, ...options]
}
