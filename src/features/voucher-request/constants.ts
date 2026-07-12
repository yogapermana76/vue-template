import type { VoucherProgramInfo, VoucherSecurityAssurance } from './types'

export const VOUCHER_PROGRAM: VoucherProgramInfo = {
  name: 'PLN Electric Run 2026',
  tagline: 'Bersama melangkah,\nenergi untuk negeri.',
  apiSlug: 'electric-run-2026',
}

export const SECURITY_ASSURANCES: VoucherSecurityAssurance[] = [
  { id: 'safe', label: 'Data Anda aman' },
  { id: 'purpose', label: 'Hanya digunakan untuk kebutuhan event' },
  { id: 'private', label: 'Tidak akan dibagikan ke pihak lain' },
]
