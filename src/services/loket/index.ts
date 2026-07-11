/**
 * Loket Services Index
 * Re-exports all loket services. When `VITE_LOKET_MOCK=true`, swaps in
 * client-side mock adapters so the entire feature works offline against
 * realistic seed data (see `./mocks/`).
 */

import { loketAuthService as realAuthService } from './auth.service'
import { loketProgramService as realProgramService } from './program.service'
import { loketMonitoringService as realMonitoringService } from './monitoring.service'
import { loketTicketService as realTicketService } from './ticket.service'
import {
  loketAuthMockService,
  loketMonitoringMockService,
  loketProgramMockService,
  loketTicketMockService,
} from './mocks'

/**
 * Loket mocks are enabled when either:
 * - `VITE_LOKET_MOCK=true` is set (opt-in), or
 * - We're running the dev server without a real Loket API base URL configured.
 *
 * This second guard means the dev experience is offline-friendly by default
 * without every developer having to manually flip the env flag.
 */
const useMocks =
  import.meta.env.VITE_LOKET_MOCK === 'true' ||
  (import.meta.env.DEV && !import.meta.env.VITE_LOKET_API_URL)

export const loketAuthService = useMocks ? loketAuthMockService : realAuthService
export const loketProgramService = useMocks ? loketProgramMockService : realProgramService
export const loketMonitoringService = useMocks ? loketMonitoringMockService : realMonitoringService
export const loketTicketService = useMocks ? loketTicketMockService : realTicketService

export * from './endpoints'
