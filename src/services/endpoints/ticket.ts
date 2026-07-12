/**
 * Ticket API Endpoints
 */
export const TicketEndpoint = {
  DETAIL: (programId: number | string, code: string) => `/v2/ticket/detail/${programId}/${code}`,
  SCAN: (code: string) => `/v2/ticket/scan/${code}`,
  CLAIM: '/v2/ticket/claim',
} as const
