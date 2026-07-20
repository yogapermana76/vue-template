/**
 * Mock data for the app — used when VITE_API_MOCK=true.
 * Data is realistic enough to exercise the entire UI (dashboard stats,
 * monitoring table with dynamic headers, ticket detail, scan flow).
 */

import type {
  Program,
  BannerURL,
  Category,
  Schedule,
  Statistics,
  ColumnHeader,
  TicketItem,
  TicketDetail,
  TicketFormField,
} from '@/types/services'

// ============================================
// Programs
// ============================================
export const mockPrograms: Program[] = [
  {
    ID: 1,
    ProgramID: 101,
    Name: 'PLN Electric Run 2026 — Jakarta',
    Title: 'PLN Electric Run 2026 — Jakarta',
    StartDate: '2026-08-01T00:00:00Z',
    EndDate: '2026-08-31T23:59:59Z',
  },
  {
    ID: 2,
    ProgramID: 102,
    Name: 'PLN Music Festival — Bandung',
    Title: 'PLN Music Festival — Bandung',
    StartDate: '2026-09-15T00:00:00Z',
    EndDate: '2026-09-17T23:59:59Z',
  },
  {
    ID: 3,
    ProgramID: 103,
    Name: 'Konser Amal Beranda Nusantara 2026',
    Title: 'Konser Amal Beranda Nusantara 2026',
    StartDate: '2026-10-01T00:00:00Z',
    EndDate: '2026-10-05T23:59:59Z',
  },
  {
    ID: 4,
    ProgramID: 104,
    Name: 'PLN Family Day',
    Title: 'PLN Family Day',
    StartDate: '2026-11-20T00:00:00Z',
    EndDate: '2026-11-20T23:59:59Z',
  },
]

// ============================================
// Banners per program
// ============================================
export const mockBanners: Record<number, BannerURL[]> = {
  1: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80',
  ],
  2: [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
  ],
  3: ['https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80'],
  4: [],
}

// ============================================
// Categories per program
// ============================================
export const mockCategories: Record<number, Category[]> = {
  1: [
    { ID: 10, Name: 'Fun Run 5K' },
    { ID: 11, Name: 'Half Marathon 21K' },
    { ID: 12, Name: 'VIP Access' },
    { ID: 13, Name: 'Kids Category' },
  ],
  2: [
    { ID: 20, Name: 'Festival Pass' },
    { ID: 21, Name: 'VIP Pass' },
    { ID: 22, Name: 'Backstage Access' },
  ],
  3: [
    { ID: 30, Name: 'Regular' },
    { ID: 31, Name: 'Premium' },
  ],
  4: [{ ID: 40, Name: 'Family Ticket' }],
}

// ============================================
// Schedules per program
// ============================================
export const mockSchedules: Record<number, Schedule[]> = {
  1: [
    { ID: 1001, StartDate: '2026-08-05T05:00:00Z', EndDate: '2026-08-05T10:00:00Z' },
    { ID: 1002, StartDate: '2026-08-12T05:00:00Z', EndDate: '2026-08-12T10:00:00Z' },
    { ID: 1003, StartDate: '2026-08-19T05:00:00Z', EndDate: '2026-08-19T10:00:00Z' },
    { ID: 1004, StartDate: '2026-08-26T05:00:00Z', EndDate: '2026-08-26T10:00:00Z' },
  ],
  2: [
    { ID: 2001, StartDate: '2026-09-15T15:00:00Z', EndDate: '2026-09-15T23:00:00Z' },
    { ID: 2002, StartDate: '2026-09-16T15:00:00Z', EndDate: '2026-09-16T23:00:00Z' },
    { ID: 2003, StartDate: '2026-09-17T15:00:00Z', EndDate: '2026-09-17T23:00:00Z' },
  ],
  3: [{ ID: 3001, StartDate: '2026-10-03T18:00:00Z', EndDate: '2026-10-03T22:00:00Z' }],
  4: [],
}

// ============================================
// Statistics per program
// ============================================
export const mockStatistics: Record<number, Statistics> = {
  1: {
    PurchasedTicketCount: 12480,
    TransactionCount: 8934,
    CheckedCount: 4256,
    BookedTicketCount: 13215,
    UncheckedCount: 8224,
    TotalIncomeAmount: 1_248_000_000,
  },
  2: {
    PurchasedTicketCount: 5680,
    TransactionCount: 4210,
    CheckedCount: 3120,
    BookedTicketCount: 6100,
    UncheckedCount: 2560,
    TotalIncomeAmount: 568_000_000,
  },
  3: {
    PurchasedTicketCount: 1250,
    TransactionCount: 980,
    CheckedCount: 780,
    BookedTicketCount: 1300,
    UncheckedCount: 470,
    TotalIncomeAmount: 187_500_000,
  },
  4: {
    PurchasedTicketCount: 340,
    TransactionCount: 280,
    CheckedCount: 120,
    BookedTicketCount: 340,
    UncheckedCount: 220,
    TotalIncomeAmount: 34_000_000,
  },
}

// ============================================
// Monitoring data — dynamic column headers per program
// ============================================
/** Monitoring table columns — labels and order match Eiger 1:1. */
export const mockMonitoringHeaders: ColumnHeader[] = [
  { Initial: 'TicketCode', Title: 'Kode Tiket' },
  { Initial: 'Fullname', Title: 'Nama Pengunjung' },
  { Initial: 'TicketCategory', Title: 'Kategori' },
  { Initial: 'TicketType', Title: 'Tipe Tiket' },
  { Initial: 'BuyerName', Title: 'Nama Pemesan' },
  { Initial: 'OrderNumber', Title: 'Nomor Pesanan' },
  { Initial: 'OrderDate', Title: 'Waktu Pemesanan', Type: 'date' },
  { Initial: 'ClaimedAt', Title: 'Waktu Check In', Type: 'date' },
  { Initial: 'Claimed', Title: 'Status', Type: 'status' },
]

const CATEGORY_NAMES_BY_PROGRAM: Record<number, string[]> = {
  1: ['Fun Run 5K', 'Half Marathon 21K', 'VIP Access', 'Kids Category'],
  2: ['Festival Pass', 'VIP Pass', 'Backstage Access'],
  3: ['Regular', 'Premium'],
  4: ['Family Ticket'],
}
const CUSTOMER_NAMES = [
  'Rangga Wirasena',
  'Dhira Puspa Wardani',
  'Bagas Adhi Nugraha',
  'Salsa Anindita Kirana',
  'Muhammad Faisal Hidayat',
  'Cinta Laura Kusumawardhani',
  'Reza Rahadian Pratama',
  'Nadia Kusuma Astuti',
  'Bimasakti Wardhana',
  'Anisa Widyawati',
  'Bagas Prasetyo',
  'Kirana Larasati',
  'Dimas Fitriansyah',
  'Meilani Rahmawati',
  'Raka Aditya Wibowo',
  'Sabrina Chairunnisa',
  'Tegar Abimanyu',
  'Widya Ningrum',
  'Yohanes Kristanto',
  'Zahra Aulia',
]
const EMAILS = [
  'rangga.w@pln.co.id',
  'dhira.puspa@pln.co.id',
  'bagas.adhi@pln.co.id',
  'salsa.anindita@pln.co.id',
  'faisal.h@pln.co.id',
  'cinta.laura@pln.co.id',
]

const TICKET_TYPES = ['Regular', 'Early Bird', 'Presale', 'On-The-Spot']
const SCANNER_OPERATORS = [
  'Petugas Loket A',
  'Petugas Loket B',
  'Petugas Loket C',
  'Ranger Tim 1',
  'Ranger Tim 2',
]
/**
 * Additional information fields per program.
 * Casing (`label`, `value`) matches Eiger's API exactly.
 */
const INFO_FIELDS_BY_PROGRAM: Record<number, Array<{ label: string; value: string }>> = {
  1: [
    { label: 'Bib Number', value: '' },
    { label: 'T-Shirt Size', value: 'L' },
    { label: 'Blood Type', value: 'O' },
    { label: 'Emergency Contact', value: '081234567890' },
  ],
  2: [
    { label: 'Wristband Color', value: 'Gold' },
    { label: 'Merchandise', value: 'Included' },
  ],
  3: [{ label: 'Seat Number', value: 'A-12' }],
  4: [{ label: 'Family Size', value: '4 orang' }],
}

const seedPrograms = new Map<number, TicketItem[]>()

function generateProgramTickets(programId: number, count: number): TicketItem[] {
  const categories = CATEGORY_NAMES_BY_PROGRAM[programId] ?? ['Regular']
  const items: TicketItem[] = []

  // Group tickets by order (2-6 tickets per order simulating families / groups)
  let orderIndex = 0
  let ticketsInCurrentOrder = 0
  let currentOrderSize = Math.floor(Math.random() * 5) + 2
  let currentOrderNumber = ''
  let currentOrderTimestamp = 0
  let currentBuyerIdx = 0

  for (let i = 0; i < count; i++) {
    // New order group
    if (ticketsInCurrentOrder >= currentOrderSize) {
      orderIndex++
      ticketsInCurrentOrder = 0
      currentOrderSize = Math.floor(Math.random() * 5) + 2
      currentOrderTimestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      currentOrderNumber = `ORD-${programId}-${String(orderIndex + 1).padStart(5, '0')}`
      currentBuyerIdx = (currentBuyerIdx + 1) % CUSTOMER_NAMES.length
    }

    const claimed = Math.random() > 0.55
    const claimTimestamp = claimed
      ? currentOrderTimestamp + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      : null
    const visitorIdx = i % CUSTOMER_NAMES.length
    const bib = String(1000 + i).padStart(4, '0')

    // Attach dynamic info fields with actual values (Bib updates per ticket)
    const baseInfo = INFO_FIELDS_BY_PROGRAM[programId] ?? []
    const populatedInfo = baseInfo.map(field =>
      field.label === 'Bib Number' ? { ...field, value: bib } : field,
    )

    // `isFirstCheckin`: true = success (freshly claimed), false = re-scan warning
    // (already-claimed ticket presented again). Randomised so both flows appear.
    const isFirstCheckin = claimed ? Math.random() > 0.15 : false

    // Timezone rotates so we exercise WIB/WITA/WIT labels the way Eiger does.
    const timezone = ['WIB', 'WITA', 'WIT'][Math.floor(programId % 3)] as 'WIB' | 'WITA' | 'WIT'

    items.push({
      TicketCode: `TKT-${programId}-${String(i + 1).padStart(6, '0')}`,
      // Visitor (attendee) — matches Eiger keys
      Fullname: CUSTOMER_NAMES[visitorIdx],
      Email: EMAILS[visitorIdx % EMAILS.length],
      PhoneNumber: `0812${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      // Ticket — Eiger keys
      TicketCategory: categories[i % categories.length],
      TicketType: TICKET_TYPES[i % TICKET_TYPES.length],
      Information: populatedInfo,
      // Buyer — Eiger keys
      OrderNumber: currentOrderNumber,
      BuyerName: CUSTOMER_NAMES[currentBuyerIdx],
      BuyerPhone: `0813${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      BuyerEmail: EMAILS[currentBuyerIdx % EMAILS.length],
      ClaimedCount: claimed ? 1 : 0,
      TotalTicket: currentOrderSize,
      // Status
      Claimed: claimed,
      isFirstCheckin,
      // Timestamps
      OrderDate: new Date(currentOrderTimestamp).toISOString(),
      ClaimedAt: claimTimestamp ? new Date(claimTimestamp).toISOString() : null,
      UpdatedBy: claimed ? SCANNER_OPERATORS[i % SCANNER_OPERATORS.length] : null,
      Timezone: timezone,
      // Validity period (per-program event dates)
      StartVisitDate: '2026-08-05',
      StartVisitTime: '05:00:00',
      EndVisitDate: '2026-08-05',
      EndVisitTime: '10:00:00',
      Amount: [100_000, 250_000, 500_000, 1_500_000][i % 4],
      // ── Backward-compat aliases (some non-Eiger consumers still use these) ──
      CustomerName: CUSTOMER_NAMES[visitorIdx],
      CustomerEmail: EMAILS[visitorIdx % EMAILS.length],
      CustomerPhone: `0812${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      CategoryName: categories[i % categories.length],
      OrderCode: currentOrderNumber,
    })

    ticketsInCurrentOrder++
  }
  return items
}

export function getMockMonitoringData(programId: number): TicketItem[] {
  if (!seedPrograms.has(programId)) {
    const size = { 1: 156, 2: 98, 3: 42, 4: 24 }[programId as 1 | 2 | 3 | 4] ?? 30
    seedPrograms.set(programId, generateProgramTickets(programId, size))
  }
  return seedPrograms.get(programId)!
}

// ============================================
// Ticket detail lookup
// ============================================
export function getMockTicketDetail(programId: number, code: string): TicketDetail | null {
  const items = getMockMonitoringData(programId)
  const item = items.find(x => x.TicketCode === code)
  if (!item) return null
  // Pass-through the enriched item — matching TicketDetail shape.
  return { ...item, TicketCode: String(item.TicketCode) } as TicketDetail
}

/** Toggle a ticket to claimed in the mock store (used by claim mutation). */
export function claimMockTickets(codes: string[]): { success: string[]; failed: string[] } {
  const success: string[] = []
  const failed: string[] = []
  for (const code of codes) {
    let found = false
    let alreadyClaimed = false
    for (const [, items] of seedPrograms) {
      const it = items.find(x => x.TicketCode === code)
      if (!it) continue
      found = true
      if (it.Claimed) {
        alreadyClaimed = true
      } else {
        it.Claimed = true
        it.ClaimedAt = new Date().toISOString()
      }
      break
    }
    // Unknown codes (not in seed) are treated as valid — real backend owns
    // that check. Only re-scans of already-claimed tickets fail.
    if (!found || !alreadyClaimed) success.push(code)
    else failed.push(code)
  }
  return { success, failed }
}

// ============================================
// Ticket form (visitor-editable fields)
// ============================================

/** Seed for `GET /v2/ticket/form/:programId/:code`. Mutated in-place by the mock editVisitor handler. */
export const mockTicketForm: TicketFormField[] = [
  {
    Name: 'phoneNumber',
    Label: 'Nomor Telpon',
    Value: '6285781007831',
    ValueId: '',
    HtmlType: 'text',
    Validation: null,
    Data: null,
    IsRequired: true,
    IsEditable: true,
    EditableRoles: null,
    EditableUntil: '',
    Description: '',
  },
  {
    Name: 'email',
    Label: 'Email',
    Value: 'fafa@yopmail.com',
    ValueId: '',
    HtmlType: 'text',
    Validation: null,
    Data: null,
    IsRequired: true,
    IsEditable: true,
    EditableRoles: null,
    EditableUntil: '',
    Description: '',
  },
  {
    Name: 'fullname',
    Label: 'Nama Lengkap',
    Value: 'Achmad Nagaria',
    ValueId: '',
    HtmlType: 'text',
    Validation: null,
    Data: null,
    IsRequired: true,
    IsEditable: true,
    EditableRoles: null,
    EditableUntil: '',
    Description: '',
  },
  {
    Name: 'apakahAndaMenjalaniPerawatanMedisDalam1BulanTerakhir?',
    Label: 'Apakah Anda menjalani perawatan medis dalam 1 bulan terakhir?',
    Value: 'Ya',
    ValueId: '52827af0-9a99-4d75-bb13-2f3835699794',
    HtmlType: 'radio',
    Validation: null,
    Data: [
      { id: '52827af0-9a99-4d75-bb13-2f3835699794', label: 'Ya' },
      { id: '2bda06d3-ddcc-4043-bca0-cd4db5eb2804', label: 'Tidak' },
    ],
    IsRequired: true,
    IsEditable: false,
    EditableRoles: null,
    EditableUntil: '',
    Description: 'Masukkan Apakah Anda menjalani perawatan medis dalam 1 bulan terakhir?',
  },
  {
    Name: 'ukuranJersey',
    Label: 'Ukuran Jersey',
    Value: 'M',
    ValueId: '4c95a1d3-9cae-4e75-9c0d-8eaec44b1e67',
    HtmlType: 'dropdown',
    Validation: null,
    Data: [
      { id: 'e58331f4-ef95-4a58-a5d8-6c45d03c9988', label: 'XS' },
      { id: 'c79732c2-6e17-4bf5-bca4-f26ca5fe6af4', label: 'S' },
      { id: '4c95a1d3-9cae-4e75-9c0d-8eaec44b1e67', label: 'M' },
      { id: 'f4c1d3d9-5db7-43b6-94e4-fb264bc0f872', label: 'L' },
      { id: '9c365654-4b4e-4bf4-b5b9-77a5d0c42ef5', label: 'XL' },
      { id: '68c8fcfb-0cb4-49bb-927b-74c4b75bc55b', label: 'XXL' },
    ],
    IsRequired: true,
    IsEditable: false,
    EditableRoles: null,
    EditableUntil: '',
    Description: 'Masukkan Ukuran Jersey',
  },
  {
    Name: 'namaPadaBib',
    Label: 'Nama pada BIB',
    Value: 'NAGAKEREN',
    ValueId: '',
    HtmlType: 'text',
    Validation: { regex: '^[A-Z0-9\\s]+$' },
    Data: null,
    IsRequired: true,
    IsEditable: false,
    EditableRoles: null,
    EditableUntil: '',
    Description: 'Masukkan Nama pada BIB',
  },
  {
    Name: 'nomorHandphoneKontakDarurat',
    Label: 'Nomor Handphone Kontak Darurat',
    Value: '081233002200',
    ValueId: '',
    HtmlType: 'tel',
    Validation: { regex: '^(\\+62|62|0)8[1-9][0-9]{6,9}$' },
    Data: null,
    IsRequired: true,
    IsEditable: false,
    EditableRoles: null,
    EditableUntil: '',
    Description: 'Masukkan Nomor Handphone Kontak Darurat',
  },
  {
    Name: 'tanggalLahir',
    Label: 'Tanggal Lahir',
    Value: '2003-07-28',
    ValueId: '',
    HtmlType: 'date',
    Validation: null,
    Data: null,
    IsRequired: true,
    IsEditable: false,
    EditableRoles: null,
    EditableUntil: '',
    Description: 'Masukkan Tanggal Lahir',
  },
  {
    Name: 'jenisKelamin',
    Label: 'Jenis Kelamin',
    Value: 'Laki - laki',
    ValueId: 'd90ef34d-5812-4337-a231-934c40fd7070',
    HtmlType: 'radio',
    Validation: null,
    Data: [
      { id: 'd90ef34d-5812-4337-a231-934c40fd7070', label: 'Laki - laki' },
      { id: 'b4de552e-0f1e-4a87-b67c-f6357dedb75a', label: 'Perempuan' },
    ],
    IsRequired: true,
    IsEditable: false,
    EditableRoles: null,
    EditableUntil: '',
    Description: 'Masukkan Jenis Kelamin',
  },
]
