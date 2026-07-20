/**
 * Mock adapters for the service layer.
 * Enabled when `VITE_API_MOCK=true` (see .env / import.meta.env).
 *
 * Each adapter mirrors the shape of the real service so `use*` composables
 * work without changes. Data lives in `data.ts` and is regenerated per session.
 */

import type {
  BannerListResponse,
  BannersParams,
  CategoriesParams,
  CategoryListResponse,
  ClaimTicketRequest,
  ClaimTicketResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MonitoringParams,
  MonitoringResponse,
  ProgramListParams,
  ProgramListResponse,
  RefreshTokenResponse,
  ScanTicketParams,
  ScanTicketResponse,
  ScheduleListParams,
  ScheduleListResponse,
  StatisticsParams,
  StatisticsResponse,
  TicketDetailParams,
  TicketDetailResponse,
  TicketFormParams,
  TicketFormResponse,
  TicketItem,
  EditVisitorBody,
  EditVisitorResponse,
  RegisterInvitationParams,
  RegisterInvitationResponse,
  InvitationProgramInfoParams,
  InvitationProgramInfoResponse,
  InvitationCategoryInfoParams,
  InvitationCategoryInfoResponse,
  InvitationSummaryParams,
  InvitationSummaryResponse,
  InvitationCountParams,
  InvitationCountResponse,
  InvitationListParams,
  InvitationListResponse,
  InvitationDetailParams,
  InvitationDetailResponse,
  ApproveInvitationBulkBody,
  ApproveInvitationBulkResponse,
  ApproveInvitationSingleBody,
  ApproveInvitationSingleResponse,
  ReleaseVoucherBody,
  ReleaseVoucherResponse,
} from '@/types/services'
import {
  claimMockTickets,
  getMockMonitoringData,
  getMockTicketDetail,
  mockBanners,
  mockCategories,
  mockPrograms,
  mockMonitoringHeaders,
  mockSchedules,
  mockStatistics,
  mockTicketForm,
} from './data'

/** Simulate network latency for a more realistic UX during dev. */
const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise(resolve => window.setTimeout(() => resolve(value), ms))

/** Simple envelope for non-paginated responses. */
const ok = <T>(
  data: T,
  message = 'OK',
): { success: true; message: string; statusCode: 200; data: T } => ({
  success: true,
  message,
  statusCode: 200,
  data,
})

/**
 * Paginated envelope — `data` and `pagination` are envelope-level siblings,
 * matching the real API (see /v2/dashboard/programs sample).
 */
const okPaged = <T>(
  data: T[],
  total: number,
  page: number,
  perPage: number,
  message = 'Berhasil',
) => ({
  success: true as const,
  message,
  statusCode: 200 as const,
  data,
  pagination: {
    Total: total,
    PerPage: perPage,
    CurrentPage: page,
    FirstPage: 1,
    LastPage: Math.max(1, Math.ceil(total / perPage)),
  },
})

// ============================================
// Auth
// ============================================
export const authMockService = {
  async login(_request: LoginRequest): Promise<LoginResponse> {
    return delay(
      ok(
        {
          AccessToken: 'mock-access-token',
          RefreshToken: 'mock-refresh-token',
          User: { FullName: 'Petugas Loket Demo', Email: 'demo@pln.co.id' },
          Role: { ID: 1, Name: 'Admin' },
          Permission: [
            {
              PermissionID: 11,
              Ctx: 'WEB_LOKET',
              ModuleID: 6,
              ModuleName: 'Tiket',
              RoleID: 1,
              PermissionName: 'Akses Scan Ticket',
              PermissionCode: 'SCAN_TIKET',
            },
            {
              PermissionID: 12,
              Ctx: 'WEB_LOKET',
              ModuleID: 7,
              ModuleName: 'Monitoring Tiket',
              RoleID: 1,
              PermissionName: 'Akses View Monitoring Ticket',
              PermissionCode: 'VIEW_MONITORING_TIKET',
            },
            {
              PermissionID: 13,
              Ctx: 'WEB_LOKET',
              ModuleID: 8,
              ModuleName: 'Dashboard',
              RoleID: 1,
              PermissionName: 'Akses View Dashboard',
              PermissionCode: 'VIEW_DASHBOARD_LOKET',
            },
          ],
        },
        'Login berhasil',
      ),
    )
  },
  async refreshToken(_refreshToken: string): Promise<RefreshTokenResponse> {
    return delay(ok({ AccessToken: 'mock-access-token', RefreshToken: 'mock-refresh-token' }))
  },
  async logout(_refreshToken: string): Promise<LogoutResponse> {
    return delay(ok({}))
  },
}

// ============================================
// Programs / dashboard
// ============================================
export const programMockService = {
  async getPrograms(params?: ProgramListParams): Promise<ProgramListResponse> {
    const perPage = params?.PerPage ?? 25
    const page = params?.Page ?? 1
    const name = (params?.Name ?? '').toLowerCase()
    const filtered = name
      ? mockPrograms.filter(p => (p.Name || p.Title || '').toLowerCase().includes(name))
      : mockPrograms
    const paged = filtered.slice((page - 1) * perPage, page * perPage)
    return delay(okPaged(paged, filtered.length, page, perPage))
  },

  async getBanners(params: BannersParams): Promise<BannerListResponse> {
    return delay(ok(mockBanners[params.programId] ?? []))
  },

  async getCategories(params: CategoriesParams): Promise<CategoryListResponse> {
    return delay(ok(mockCategories[params.programId] ?? []))
  },

  async getSchedules(params: ScheduleListParams): Promise<ScheduleListResponse> {
    const perPage = params.PerPage ?? 25
    const page = params.Page ?? 1
    const all = mockSchedules[params.programId] ?? []
    const paged = all.slice((page - 1) * perPage, page * perPage)
    return delay(okPaged(paged, all.length, page, perPage))
  },

  async getStatistics(params: StatisticsParams): Promise<StatisticsResponse> {
    const stats = mockStatistics[params.programId] ?? {
      PurchasedTicketCount: 0,
      TransactionCount: 0,
      CheckedCount: 0,
      BookedTicketCount: 0,
      UncheckedCount: 0,
      TotalIncomeAmount: 0,
    }
    return delay(ok(stats))
  },
}

// ============================================
// Monitoring
// ============================================
export const monitoringMockService = {
  async getMonitoring(params: MonitoringParams): Promise<MonitoringResponse> {
    const perPage = params.PerPage ?? 25
    const page = params.Page ?? 1
    let items: TicketItem[] = getMockMonitoringData(params.programId)

    // Apply filters (best-effort text search)
    if (params.Keyword) {
      const q = params.Keyword.toLowerCase()
      items = items.filter(
        it =>
          String(it.TicketCode ?? '')
            .toLowerCase()
            .includes(q) ||
          String(it.CustomerName ?? '')
            .toLowerCase()
            .includes(q) ||
          String(it.CustomerEmail ?? '')
            .toLowerCase()
            .includes(q),
      )
    }
    if (params.Claimed !== undefined) {
      items = items.filter(it => it.Claimed === params.Claimed)
    }
    if (params.OrderStartDate) {
      const t = new Date(params.OrderStartDate).getTime()
      items = items.filter(it => new Date(String(it.OrderDate)).getTime() >= t)
    }
    if (params.OrderEndDate) {
      const t = new Date(params.OrderEndDate).getTime()
      items = items.filter(it => new Date(String(it.OrderDate)).getTime() <= t)
    }

    const paged = items.slice((page - 1) * perPage, page * perPage)
    // Monitoring envelope has an extra `header` field at envelope level.
    return delay({
      ...okPaged(paged, items.length, page, perPage),
      header: mockMonitoringHeaders,
    })
  },

  async exportMonitoring(_params: MonitoringParams): Promise<Blob> {
    // Return a tiny CSV blob as a stand-in for the real .xlsx.
    const rows = getMockMonitoringData(_params.programId)
    const header = 'TicketCode,CustomerName,Category,OrderDate,Amount,Claimed\n'
    const body = rows
      .map(
        r =>
          `${r.TicketCode},${r.CustomerName},${r.CategoryName},${r.OrderDate},${r.Amount},${r.Claimed ? 'Yes' : 'No'}`,
      )
      .join('\n')
    return delay(new Blob([header + body], { type: 'text/csv' }))
  },
}

// ============================================
// Tickets
// ============================================
export const ticketMockService = {
  async getDetail(params: TicketDetailParams): Promise<TicketDetailResponse> {
    const detail = getMockTicketDetail(params.programId, params.code)
    if (!detail) {
      return delay({
        success: false,
        message: 'Tiket tidak ditemukan',
        code: '4004',
        data: null,
      } as unknown as TicketDetailResponse)
    }
    return delay(ok(detail))
  },

  async scanTicket(params: ScanTicketParams): Promise<ScanTicketResponse> {
    // Find any program that owns this code.
    for (const prog of mockPrograms) {
      const items = getMockMonitoringData(prog.ID)
      const found = items.find(it => it.TicketCode === params.code)
      if (found) {
        return delay(ok({ TicketCode: params.code, IsValid: !found.Claimed }))
      }
    }
    return delay(ok({ TicketCode: params.code, IsValid: false }))
  },

  async claimTicket(request: ClaimTicketRequest): Promise<ClaimTicketResponse> {
    const { success, failed } = claimMockTickets(request.Codes)
    return delay(ok({ SuccessCodes: success, FailedCodes: failed }))
  },

  async getForm(_params: TicketFormParams): Promise<TicketFormResponse> {
    return delay(ok(mockTicketForm))
  },

  async editVisitor(body: EditVisitorBody): Promise<EditVisitorResponse> {
    for (const field of body.fields) {
      const target = mockTicketForm.find(f => f.Name === field.name)
      if (target && target.IsEditable) {
        target.Value = field.value
        target.ValueId = field.valueId
      }
    }
    return delay(ok({} as Record<string, never>))
  },
}

// ============================================
// Invitation (voucher-request)
// ============================================

const MOCK_INVITATION_CATEGORIES_WITH_TICKETS = [
  {
    CategoryID: 284,
    CategoryName: 'Invitation',
    Tickets: [
      { TicketID: 355, TicketName: '5K', Quota: 90 },
      { TicketID: 357, TicketName: '10K', Quota: 90 },
    ],
  },
]

const MOCK_INVITATION_PROGRAM = {
  ProgramID: 184,
  ProgramName: 'Electric Run 2026 [TEST by Naga] 2',
  Categories: MOCK_INVITATION_CATEGORIES_WITH_TICKETS.map(c => ({
    CategoryID: c.CategoryID,
    CategoryName: c.CategoryName,
  })),
}

// Random 7-char code, mirrors backend example (e.g. "SV90EEO").
const generateInvitationCode = () =>
  Array.from({ length: 7 }, () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36)),
  ).join('')

export const invitationMockService = {
  async register(_params: RegisterInvitationParams): Promise<RegisterInvitationResponse> {
    return delay(ok({ Code: generateInvitationCode() }))
  },

  async getProgramInfo(
    _params: InvitationProgramInfoParams,
  ): Promise<InvitationProgramInfoResponse> {
    return delay(ok(MOCK_INVITATION_PROGRAM))
  },

  async getCategoryInfo(
    params: InvitationCategoryInfoParams,
  ): Promise<InvitationCategoryInfoResponse> {
    const category = MOCK_INVITATION_CATEGORIES_WITH_TICKETS.find(
      c => c.CategoryID === params.categoryId,
    )
    if (!category) {
      return delay({
        success: false,
        message: 'Kategori tidak ditemukan',
        statusCode: 404,
        data: null,
      } as unknown as InvitationCategoryInfoResponse)
    }
    return delay(ok(category))
  },

  async getSummary(_params: InvitationSummaryParams): Promise<InvitationSummaryResponse> {
    return delay(
      ok([
        {
          CategoryId: 284,
          CategoryName: 'Invitation',
          TotalQuota: 200,
          TotalPending: 89,
          TotalApproved: 5,
          TotalDisapproved: 0,
          Tickets: [
            { Id: 357, Name: '10K', Quota: 100, Pending: 44, Approved: 2, Disapproved: 0 },
            { Id: 355, Name: '5K', Quota: 100, Pending: 45, Approved: 3, Disapproved: 0 },
          ],
        },
      ]),
    )
  },

  async getCount(_params: InvitationCountParams): Promise<InvitationCountResponse> {
    return delay(ok({ Pending: 37, Approved: 2, Disapproved: 0 }))
  },

  async getList(params: InvitationListParams): Promise<InvitationListResponse> {
    const page = params.query?.page ?? 1
    const size = params.query?.size ?? 10
    return delay({
      success: true,
      message: 'Berhasil',
      statusCode: 200,
      data: [
        {
          ID: 71,
          RequestCode: 'TUF2FXY',
          CreatedAt: '2026-07-13T14:29:57.13666+07:00',
          Name: 'Achmad Nagaria',
          Phone: '+62 812-3300-1100',
          Email: 'ach.nagaria@gmail.com',
          CompanyName: 'PLN',
          CategoryName: 'Tike Invitation',
          TotalQuota: 1,
        },
      ],
      header: [
        { Initial: 'RequestCode', Title: 'ID Pengajuan', Type: 'string' },
        { Initial: 'CreatedAt', Title: 'Tanggal Pengajuan', Type: 'time' },
        { Initial: 'Name', Title: 'Nama', Type: 'string' },
        { Initial: 'Phone', Title: 'Nomor HP', Type: 'string' },
        { Initial: 'Email', Title: 'Email', Type: 'string' },
        { Initial: 'CompanyName', Title: 'Perusahaan / Komunitas', Type: 'string' },
        { Initial: 'CategoryName', Title: 'Kategori', Type: 'string' },
        { Initial: 'TotalQuota', Title: 'Total Jumlah', Type: 'int' },
      ],
      pagination: {
        Total: 1,
        PerPage: size,
        CurrentPage: page,
        FirstPage: 1,
        LastPage: 1,
      },
    })
  },

  async getDetail(params: InvitationDetailParams): Promise<InvitationDetailResponse> {
    return delay(
      ok({
        ID: params.id,
        RequestCode: 'AUGJB46',
        Status: 'approved' as const,
        CreatedAt: '2026-07-13T12:18:45.277095+07:00',
        Name: 'Achmad Nagaria',
        Phone: '+62 812-3300-1100',
        Email: 'ach.nagaria@gmail.com',
        CompanyName: 'PLN',
        Tickets: [
          {
            TicketID: 355,
            CategoryName: 'Invitation',
            TicketName: '5K',
            Quota: 1,
            QuotaApproved: 1,
          },
          {
            TicketID: 357,
            CategoryName: 'Invitation',
            TicketName: '10K',
            Quota: 1,
            QuotaApproved: 1,
          },
        ],
        Vouchers: [
          {
            VoucherID: 31,
            Code: 'F421588A',
            CreatedAt: '2026-07-13T18:23:27.524818+07:00',
            Status: 'AVAILABLE',
            CategoryName: 'Invitation',
            TicketName: '5K',
            Releasable: false,
          },
          {
            VoucherID: 32,
            Code: 'A2A03D03',
            CreatedAt: '2026-07-13T18:23:27.640134+07:00',
            Status: 'AVAILABLE',
            CategoryName: 'Invitation',
            TicketName: '10K',
            Releasable: false,
          },
        ],
      }),
    )
  },

  async approveBulk(_body: ApproveInvitationBulkBody): Promise<ApproveInvitationBulkResponse> {
    return delay(ok({}, 'Berhasil melakukan distribusi voucher'))
  },

  async approveSingle(
    _body: ApproveInvitationSingleBody,
  ): Promise<ApproveInvitationSingleResponse> {
    return delay(ok({}, 'Berhasil'))
  },

  async releaseVoucher(_body: ReleaseVoucherBody): Promise<ReleaseVoucherResponse> {
    return delay(ok({}, 'Berhasil me-release voucher.'))
  },
}
