// Compact ID number formatter (T/M/Jt/Rb suffixes). Hand-rolled instead of
// Intl `notation: 'compact'` because id-ID casing/suffix output is inconsistent.

type CompactUnit = { threshold: number; suffix: string; digits: number }

const UNITS: CompactUnit[] = [
  { threshold: 1_000_000_000_000, suffix: ' T', digits: 2 },
  { threshold: 1_000_000_000, suffix: ' M', digits: 2 },
  { threshold: 1_000_000, suffix: ' Jt', digits: 1 },
  { threshold: 1_000, suffix: ' Rb', digits: 1 },
]

const LOCALE = 'id-ID'

function formatWithUnit(value: number): string {
  for (const unit of UNITS) {
    if (Math.abs(value) >= unit.threshold) {
      const scaled = value / unit.threshold
      const digits = Math.abs(scaled) >= 100 ? 0 : Math.abs(scaled) >= 10 ? 1 : unit.digits
      return (
        scaled.toLocaleString(LOCALE, {
          minimumFractionDigits: 0,
          maximumFractionDigits: digits,
        }) + unit.suffix
      )
    }
  }
  return value.toLocaleString(LOCALE)
}

export function formatCompactRupiah(value: number): string {
  return `Rp ${formatWithUnit(value)}`
}

export function formatCompactNumber(value: number): string {
  return formatWithUnit(value)
}
