/**
 * Lifestyle Ticket Service
 * Handles ticket-related API calls for Lifestyle (My Ticket)
 */

import { http } from '../http'
import { LifestyleTicketEndpoint } from './endpoints'
import type {
  LifestyleGetMyTicketsParams,
  LifestyleGetMyTicketsResponse,
  LifestyleGetTicketDetailParams,
  LifestyleGetTicketDetailResponse,
  LifestyleDownloadETicketParams,
  LifestyleDownloadETicketResponse,
  LifestyleGetTicketByOrderParams,
  LifestyleGetTicketByOrderResponse,
} from '@/types/services/lifestyle'

export const lifestyleTicketService = {
  /**
   * Get my tickets
   */
  async getMyTickets(params?: LifestyleGetMyTicketsParams): Promise<LifestyleGetMyTicketsResponse> {
    const { data } = await http.get<LifestyleGetMyTicketsResponse>(
      LifestyleTicketEndpoint.MY_TICKETS,
      { params },
    )
    return data
  },

  /**
   * Get ticket detail
   */
  async getDetail(
    params: LifestyleGetTicketDetailParams,
  ): Promise<LifestyleGetTicketDetailResponse> {
    const { data } = await http.get<LifestyleGetTicketDetailResponse>(
      LifestyleTicketEndpoint.DETAIL,
      { params },
    )
    return data
  },

  /**
   * Download e-ticket
   */
  async downloadETicket(
    params: LifestyleDownloadETicketParams,
  ): Promise<LifestyleDownloadETicketResponse> {
    const { data } = await http.get<LifestyleDownloadETicketResponse>(
      LifestyleTicketEndpoint.DOWNLOAD_ETICKET,
      { params },
    )
    return data
  },

  /**
   * Get tickets by order ID
   */
  async getByOrder(
    params: LifestyleGetTicketByOrderParams,
  ): Promise<LifestyleGetTicketByOrderResponse> {
    const { data } = await http.get<LifestyleGetTicketByOrderResponse>(
      LifestyleTicketEndpoint.BY_ORDER,
      { params },
    )
    return data
  },
}
