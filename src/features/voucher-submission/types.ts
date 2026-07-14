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
  id: number
  requestCode: string
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
  ticketId: number
  category: SubmissionCategory
  type: string
  requested: number
  approved?: number
}

export type VoucherUsageStatus = 'used' | 'unused'

export interface SubmissionVoucherCode {
  no: number
  voucherId: number
  code: string
  generatedAt: string
  status: VoucherUsageStatus
  category: SubmissionCategory
  type: string
  /** Server-side gate for the release action. */
  releasable: boolean
}

export interface SubmissionDetail extends SubmissionRow {
  quantities: SubmissionQuantityDetail[]
  vouchers: SubmissionVoucherCode[]
}
