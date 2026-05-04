/**
 * Voucher Service
 * Handles user voucher API calls (requires auth)
 */

import { http } from './http'
import { VoucherEndpoint } from './endpoints'
import type {
  VoucherPagesResponse,
  VoucherDetailResponse,
  VoucherCodesResponse,
  VoucherCategoryResponse,
  VoucherPagesParams,
  VoucherDetailParams,
  VoucherDetailsPagesParams,
} from '@/types'

export const voucherService = {
  /**
   * Get user vouchers with pagination
   */
  async pages(params?: VoucherPagesParams): Promise<VoucherPagesResponse> {
    const { data } = await http.get<VoucherPagesResponse>(VoucherEndpoint.PAGES, { params })
    return data
  },

  /**
   * Get voucher detail
   */
  async detail(params: VoucherDetailParams): Promise<VoucherDetailResponse> {
    const { data } = await http.get<VoucherDetailResponse>(VoucherEndpoint.DETAIL, { params })
    return data
  },

  /**
   * Get voucher codes details with pagination for a specific voucherId
   */
  async detailsPages(params: VoucherDetailsPagesParams): Promise<VoucherCodesResponse> {
    const { data } = await http.get<VoucherCodesResponse>(VoucherEndpoint.DETAILS_PAGES, { params })
    return data
  },

  /**
   * Get voucher categories
   */
  async categories(): Promise<VoucherCategoryResponse> {
    const { data } = await http.get<VoucherCategoryResponse>(VoucherEndpoint.CATEGORY)
    return data
  },
}
