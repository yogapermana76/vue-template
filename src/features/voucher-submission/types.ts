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
  id: string
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
