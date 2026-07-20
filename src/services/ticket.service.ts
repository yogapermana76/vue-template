/**
 * Ticket Service
 * Handles ticket scan and claim for the app.
 *
 * Scan + detail endpoints are called with `showErrorToast: false` — those
 * flows have their own UI feedback (result panel, ticket preview card) and
 * a top-level toast would double up on the user. Claim + mutations still
 * surface toasts by default so ranger operators see network failures.
 */

import { http } from './http'
import type { HttpConfig } from './http'
import { TicketEndpoint } from './endpoints'
import type {
  TicketDetailParams,
  ScanTicketParams,
  ClaimTicketRequest,
  TicketDetailResponse,
  ScanTicketResponse,
  ClaimTicketResponse,
  TicketFormParams,
  TicketFormResponse,
  EditVisitorBody,
  EditVisitorResponse,
} from '@/types/services'

/** Axios config with our custom `showErrorToast` flag from `interceptors.ts`. */
const SILENT: HttpConfig = { showErrorToast: false }

export const ticketService = {
  async getDetail(params: TicketDetailParams): Promise<TicketDetailResponse> {
    const { data } = await http.get<TicketDetailResponse>(
      TicketEndpoint.DETAIL(params.programId, params.code),
      SILENT,
    )
    return data
  },

  async scanTicket(params: ScanTicketParams): Promise<ScanTicketResponse> {
    const { data } = await http.get<ScanTicketResponse>(TicketEndpoint.SCAN(params.code), SILENT)
    return data
  },

  async claimTicket(request: ClaimTicketRequest): Promise<ClaimTicketResponse> {
    const { data } = await http.post<ClaimTicketResponse>(TicketEndpoint.CLAIM, request)
    return data
  },

  async getForm(params: TicketFormParams): Promise<TicketFormResponse> {
    const { data } = await http.get<TicketFormResponse>(
      TicketEndpoint.FORM(params.programId, params.code),
      SILENT,
    )
    return data
  },

  async editVisitor(body: EditVisitorBody): Promise<EditVisitorResponse> {
    const { data } = await http.put<EditVisitorResponse>(TicketEndpoint.EDIT_VISITOR, body)
    return data
  },
}
