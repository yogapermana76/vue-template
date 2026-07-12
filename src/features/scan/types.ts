import type { ScanResult } from '@/types/services'

/** Scan workflow: idle → scanning → verifying → list → confirming → claiming → success (any → error). */
export type ScanState =
  | 'idle'
  | 'scanning'
  | 'verifying'
  | 'list'
  | 'confirming'
  | 'claiming'
  | 'success'
  | 'error'

export interface ScanHistoryEntry {
  code: string
  timestamp: number
  status: 'valid' | 'invalid' | 'claimed' | 'error'
  ticketName?: string
  message?: string
}

export interface ScanOutcome {
  code: string
  scanResult?: ScanResult
  /** HTTP status (200/400/404). Undefined for network failures. Drives mascot variant. */
  statusCode?: number
  /** Server-provided error message; preferred over `errorMessage`. */
  serverMessage?: string
  errorMessage?: string
  /** Claim breakdown from POST /v2/ticket/claim — populated on partial-success bulk claims. */
  successCodes?: string[]
  failedCodes?: string[]
}
