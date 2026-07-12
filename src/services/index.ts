/**
 * Services Index
 * Re-exports all service adapters. When `VITE_API_MOCK=true`, swaps in
 * client-side mock adapters so the entire feature works offline against
 * realistic seed data (see `./mocks/`).
 */

import { authService as realAuthService } from './auth.service'
import { programService as realProgramService } from './program.service'
import { monitoringService as realMonitoringService } from './monitoring.service'
import { ticketService as realTicketService } from './ticket.service'
import { invitationService as realInvitationService } from './invitation.service'
import {
  authMockService,
  monitoringMockService,
  programMockService,
  ticketMockService,
  invitationMockService,
} from './mocks'

/**
 * API mocks are enabled when either:
 * - `VITE_API_MOCK=true` is set (opt-in), or
 * - We're running the dev server without a real API base URL configured.
 *
 * This second guard means the dev experience is offline-friendly by default
 * without every developer having to manually flip the env flag.
 */
const useMocks =
  import.meta.env.VITE_API_MOCK === 'true' ||
  (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL)

export const authService = useMocks ? authMockService : realAuthService
export const programService = useMocks ? programMockService : realProgramService
export const monitoringService = useMocks ? monitoringMockService : realMonitoringService
export const ticketService = useMocks ? ticketMockService : realTicketService
export const invitationService = useMocks ? invitationMockService : realInvitationService

export * from './endpoints'
