import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/currency'

const EMPTY = '—'

export function formatDateCell(value: unknown): string {
  if (!value) return EMPTY
  try {
    return formatDate(String(value), 'd MMM yyyy · HH:mm')
  } catch {
    return String(value)
  }
}

export function formatAmountCell(value: unknown): string {
  if (value === null || value === undefined || value === '') return EMPTY
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return formatCurrency(num, 'IDR')
}
