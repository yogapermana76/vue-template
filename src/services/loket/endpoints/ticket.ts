/**
 * Loket Ticket API Endpoints
 */
export const LoketTicketEndpoint = {
  DETAIL: '/v2/ticket/detail/:programId/:code',
  SCAN: '/v2/ticket/scan/:code',
  CLAIM: '/v2/ticket/claim',
} as const
