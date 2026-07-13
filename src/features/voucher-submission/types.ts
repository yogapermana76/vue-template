export type SubmissionStatus = 'approved' | 'pending' | 'rejected'

export type SubmissionCategory = string

export interface QuotaBucket {
  id: string
  label: string
  used: number
}

export interface QuotaGroup {
  id: string
  name: SubmissionCategory
  used: number
  total: number
  buckets: QuotaBucket[]
}

export interface SubmissionRow {
  /** Human-facing identifier (e.g. RequestCode `TUF2FXY`). Used as row key + URL segment. */
  id: string
  /** Numeric backend ID — required for mutation endpoints (approve/reject). */
  backendId: number
  submittedAt: string
  name: string
  phone: string
  email: string
  company: string
  category: SubmissionCategory
  totalVouchers: number
  status: SubmissionStatus
}

export interface SubmissionQuantityDetail {
  id: string
  category: SubmissionCategory
  type: string
  requested: number
  approved?: number
}

export type VoucherUsageStatus = 'used' | 'unused'

export interface SubmissionVoucherCode {
  no: number
  code: string
  generatedAt: string
  status: VoucherUsageStatus
  category: SubmissionCategory
  type: string
}

export interface SubmissionDetail extends SubmissionRow {
  quantities: SubmissionQuantityDetail[]
  vouchers: SubmissionVoucherCode[]
}
