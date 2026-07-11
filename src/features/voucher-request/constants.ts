import type {
  TicketCategoryOption,
  VoucherCategory,
  VoucherProgramInfo,
  VoucherSecurityAssurance,
} from './types'

export const VOUCHER_PROGRAM: VoucherProgramInfo = {
  name: 'PLN Electric Run 2026',
  tagline: 'Bersama melangkah,\nenergi untuk negeri.',
}

export const VOUCHER_CATEGORIES: VoucherCategory[] = [
  { id: '5k', label: '5K' },
  { id: '10k', label: '10K' },
  { id: '21k', label: '21K' },
]

export const TICKET_CATEGORY_OPTIONS: TicketCategoryOption[] = [
  { value: 'invitation', label: 'Kategori Invitation' },
  { value: 'internal', label: 'Kategori Internal PLN' },
  { value: 'vip', label: 'Kategori VIP' },
  { value: 'partner', label: 'Kategori Partner' },
]

export const SECURITY_ASSURANCES: VoucherSecurityAssurance[] = [
  { id: 'safe', label: 'Data Anda aman' },
  { id: 'purpose', label: 'Hanya digunakan untuk kebutuhan event' },
  { id: 'private', label: 'Tidak akan dibagikan ke pihak lain' },
]

export const VOUCHER_MAX_PER_CATEGORY = 99
