/**
 * Loket Ticket Service
 * Handles ticket scan and claim for the Loket module.
 *
 * Scan + detail endpoints are called with `showErrorToast: false` — those
 * flows have their own UI feedback (result panel, ticket preview card) and
 * a top-level toast would double up on the user. Claim + mutations still
 * surface toasts by default so ranger operators see network failures.
 */

import { loketHttp } from '../http'
import type { HttpConfig } from '../http'
import { LoketTicketEndpoint } from './endpoints'
import type {
  LoketTicketDetailParams,
  LoketScanTicketParams,
  LoketClaimTicketRequest,
  LoketTicketDetailResponse,
  LoketScanTicketResponse,
  LoketClaimTicketResponse,
} from '@/types/services/loket'

/** Axios config with our custom `showErrorToast` flag from `interceptors.ts`. */
const SILENT: HttpConfig = { showErrorToast: false }

export const loketTicketService = {
  async getDetail(params: LoketTicketDetailParams): Promise<LoketTicketDetailResponse> {
    const url = LoketTicketEndpoint.DETAIL.replace(':programId', String(params.programId)).replace(
      ':code',
      params.code,
    )
    const { data } = await loketHttp.get<LoketTicketDetailResponse>(url, SILENT)
    return data
  },

  async scanTicket(params: LoketScanTicketParams): Promise<LoketScanTicketResponse> {
    const url = LoketTicketEndpoint.SCAN.replace(':code', params.code)
    const { data } = await loketHttp.get<LoketScanTicketResponse>(url, SILENT)
    return data
  },

  async claimTicket(request: LoketClaimTicketRequest): Promise<LoketClaimTicketResponse> {
    const { data } = await loketHttp.post<LoketClaimTicketResponse>(
      LoketTicketEndpoint.CLAIM,
      request,
    )
    return data
  },
}
