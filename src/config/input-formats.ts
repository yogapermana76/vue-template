import type { Component } from 'vue'

export interface InputFormat {
  /** Prefix text */
  prefix?: string
  /** Suffix text */
  suffix?: string
  /** Prefix icon component */
  prefixIcon?: Component
  /** Suffix icon component */
  suffixIcon?: Component
}

/**
 * Predefined input formats that can be used across the application.
 * You can extend this object with custom formats as needed.
 *
 * @example
 * ```ts
 * // Add custom format
 * inputFormats.tiket = { prefix: 'Tiket' }
 *
 * // Use in component
 * <TextField format="tiket" />
 * ```
 */
export const inputFormats = {
  /** Currency format with "Rp" prefix */
  currency: {
    prefix: 'Rp',
  },

  /** Percentage format with "%" suffix */
  percentage: {
    suffix: '%',
  },

  /** Decimal currency with two decimal places */
  currencyDecimal: {
    prefix: 'Rp',
    suffix: '.00',
  },

  /** Dollar currency format */
  usd: {
    prefix: '$',
  },

  /** Euro currency format */
  euro: {
    prefix: '€',
  },

  /** Kilogram weight format */
  kg: {
    suffix: 'kg',
  },

  /** Gram weight format */
  gram: {
    suffix: 'gram',
  },

  /** Meter distance format */
  meter: {
    suffix: 'm',
  },

  /** Kilometer distance format */
  km: {
    suffix: 'km',
  },

  /** Centimeter distance format */
  cm: {
    suffix: 'cm',
  },

  /** Days duration format */
  days: {
    suffix: 'hari',
  },

  /** Hours duration format */
  hours: {
    suffix: 'jam',
  },

  /** Minutes duration format */
  minutes: {
    suffix: 'menit',
  },

  /** Seconds duration format */
  seconds: {
    suffix: 'detik',
  },

  /** Pieces/Units quantity format */
  pcs: {
    suffix: 'pcs',
  },

  /** Units quantity format */
  unit: {
    suffix: 'unit',
  },

  /** Box quantity format */
  box: {
    suffix: 'box',
  },

  /** Ticket quantity format */
  tiket: {
    prefix: 'Tiket',
  },

  /** Person/People quantity format */
  orang: {
    suffix: 'orang',
  },

  /** Item quantity format */
  item: {
    suffix: 'item',
  },

  /** Liter volume format */
  liter: {
    suffix: 'liter',
  },

  /** Milliliter volume format */
  ml: {
    suffix: 'ml',
  },
} as const satisfies Record<string, InputFormat>

/**
 * Type for available input format keys.
 * This will be auto-updated when you add new formats to inputFormats.
 */
export type InputFormatKey = keyof typeof inputFormats

/**
 * Get input format configuration by key
 *
 * @param key - The format key from inputFormats
 * @returns InputFormat configuration or undefined if not found
 *
 * @example
 * ```ts
 * const currencyFormat = getInputFormat('currency')
 * // { prefix: 'Rp' }
 * ```
 */
export function getInputFormat(key: string): InputFormat | undefined {
  return inputFormats[key as InputFormatKey]
}

/**
 * Register a custom input format
 *
 * @param key - Unique key for the format
 * @param format - Format configuration
 *
 * @example
 * ```ts
 * registerInputFormat('tiket', { prefix: 'Tiket' })
 * registerInputFormat('custom', { prefix: 'Custom', suffix: 'unit' })
 * ```
 */
export function registerInputFormat(key: string, format: InputFormat): void {
  ;(inputFormats as Record<string, InputFormat>)[key] = format
}
