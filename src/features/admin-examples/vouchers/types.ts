export type VoucherKind = 'percentage' | 'fixed' | 'shipping'
export type VoucherStatus = 'active' | 'scheduled' | 'expired' | 'disabled'

export interface Voucher {
  id: string
  code: string
  description: string
  kind: VoucherKind
  amount: number
  minSpend: number
  usageLimit: number
  usageCount: number
  startsAt: string
  endsAt: string
  status: VoucherStatus
}

export type VoucherFormValues = Pick<
  Voucher,
  | 'code'
  | 'description'
  | 'kind'
  | 'amount'
  | 'minSpend'
  | 'usageLimit'
  | 'startsAt'
  | 'endsAt'
  | 'status'
>

export type VoucherStatusFilter = 'all' | VoucherStatus
