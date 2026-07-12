/**
 * Invitation Service
 *
 * `register` + `get*Info` use `publicHttp` (no auth interceptor) — these
 * are open to visitors filling the voucher-request form. `approve` uses
 * `http` since only signed-in operators can approve codes.
 */

import { http, publicHttp } from './http'
import { InvitationEndpoint } from './endpoints'
import type {
  RegisterInvitationParams,
  RegisterInvitationResponse,
  InvitationProgramInfoParams,
  InvitationProgramInfoResponse,
  InvitationCategoryInfoParams,
  InvitationCategoryInfoResponse,
  ApproveInvitationBody,
  ApproveInvitationResponse,
} from '@/types/services'

export const invitationService = {
  async register(params: RegisterInvitationParams): Promise<RegisterInvitationResponse> {
    const { data } = await publicHttp.post<RegisterInvitationResponse>(
      InvitationEndpoint.REGISTER(params.programSlug),
      params.body,
    )
    return data
  },

  async getProgramInfo(
    params: InvitationProgramInfoParams,
  ): Promise<InvitationProgramInfoResponse> {
    const { data } = await publicHttp.get<InvitationProgramInfoResponse>(
      InvitationEndpoint.PROGRAM_INFO(params.programId),
    )
    return data
  },

  async getCategoryInfo(
    params: InvitationCategoryInfoParams,
  ): Promise<InvitationCategoryInfoResponse> {
    const { data } = await publicHttp.get<InvitationCategoryInfoResponse>(
      InvitationEndpoint.CATEGORY_INFO(params.programId, params.categoryId),
    )
    return data
  },

  async approve(body: ApproveInvitationBody): Promise<ApproveInvitationResponse> {
    const { data } = await http.post<ApproveInvitationResponse>(InvitationEndpoint.APPROVE, body)
    return data
  },
}
