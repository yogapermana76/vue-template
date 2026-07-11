import type { LoketScanResult } from '@/types/services/loket'

/** Valid when any Unclaimed entry has `Claimable: true`. Legacy `IsValid` boolean is honoured. */
export function isScanResultValid(result: LoketScanResult | undefined | null): boolean {
  if (!result) return false
  if (typeof (result as { IsValid?: unknown }).IsValid === 'boolean') {
    return (result as { IsValid: boolean }).IsValid
  }
  const unclaimed = result.Unclaimed ?? []
  return unclaimed.some(t => t.Claimable)
}
