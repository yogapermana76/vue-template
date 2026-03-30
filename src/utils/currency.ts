export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'SGD' | 'MYR' | 'THB' | 'JPY' | 'AUD' | 'GBP'
export type LocaleCode =
  | 'id-ID'
  | 'en-US'
  | 'de-DE'
  | 'en-SG'
  | 'ms-MY'
  | 'th-TH'
  | 'ja-JP'
  | 'en-AU'
  | 'en-GB'

const STANDARD_DECIMALS = 2
const NO_DECIMALS = 0

const CURRENCY_CONFIG: Record<CurrencyCode, { locale: LocaleCode; decimals: number }> = {
  IDR: { locale: 'id-ID', decimals: NO_DECIMALS },
  USD: { locale: 'en-US', decimals: STANDARD_DECIMALS },
  EUR: { locale: 'de-DE', decimals: STANDARD_DECIMALS },
  SGD: { locale: 'en-SG', decimals: STANDARD_DECIMALS },
  MYR: { locale: 'ms-MY', decimals: STANDARD_DECIMALS },
  THB: { locale: 'th-TH', decimals: STANDARD_DECIMALS },
  JPY: { locale: 'ja-JP', decimals: NO_DECIMALS },
  AUD: { locale: 'en-AU', decimals: STANDARD_DECIMALS },
  GBP: { locale: 'en-GB', decimals: STANDARD_DECIMALS },
}

export function validateNumber(value: number | string): number | null {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(num) ? null : num
}

/**
 * Format number as currency with proper locale formatting
 * @param amount - The number to format
 * @param currency - Currency code (default: 'IDR')
 * @returns Formatted currency string or empty string on error
 * @example
 * formatCurrency(1000, 'IDR') // 'Rp1.000'
 * formatCurrency(1000.50, 'USD') // '$1,000.50'
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'IDR'): string {
  try {
    const validAmount = validateNumber(amount)
    if (validAmount === null) return ''

    const config = CURRENCY_CONFIG[currency]

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(validAmount)
  } catch {
    return ''
  }
}

/**
 * Format number with locale-specific thousand separators
 * @param number - The number to format
 * @param locale - Locale code for formatting (default: 'id-ID')
 * @returns Formatted number string or empty string on error
 * @example
 * formatNumber(1000, 'id-ID') // '1.000'
 * formatNumber(1000, 'en-US') // '1,000'
 */
export function formatNumber(number: number | string, locale: LocaleCode = 'id-ID'): string {
  try {
    const validNumber = validateNumber(number)
    if (validNumber === null) return ''

    return new Intl.NumberFormat(locale).format(validNumber)
  } catch {
    return ''
  }
}

/**
 * Parse price string to number, handling Indonesian format
 * @param priceString - Price string to parse (e.g., 'Rp 1.000.000,50')
 * @returns Parsed number or 0 on error
 * @example
 * parsePrice('Rp 1.000.000,50') // 1000000.5
 * parsePrice('$1,000.50') // 1000.5
 */
export function parsePrice(priceString: string): number {
  try {
    if (typeof priceString !== 'string') return 0

    const cleanPrice = priceString
      .replace(/[^\d.,]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')

    const result = parseFloat(cleanPrice)
    return isNaN(result) ? 0 : result
  } catch {
    return 0
  }
}
