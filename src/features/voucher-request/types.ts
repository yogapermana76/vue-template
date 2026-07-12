export interface VoucherCategory {
  id: string
  label: string
  /** Remaining backend quota. `0` = habis. */
  quota: number
}

export interface TicketCategoryOption {
  value: string
  label: string
}

export interface VoucherProgramInfo {
  name: string
  tagline: string
  apiSlug: string
}

export interface VoucherSecurityAssurance {
  id: string
  label: string
}
