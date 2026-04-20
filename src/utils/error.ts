/**
 * Error Handling
 *
 * Simple error utilities tanpa custom classes.
 */

import type { ApiErrorData, ApiErrorResponse } from '@/types'

export interface AppError {
  message: string
  code?: string
  status?: number
}

/**
 * Extracted API error with title and description for UI display
 */
export interface ExtractedApiError {
  title: string
  description: string
  deeplink?: string
}

/**
 * Type guard to check if response has API error data structure
 */
function hasApiErrorData(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    typeof (data as ApiErrorResponse).data === 'object' &&
    (data as ApiErrorResponse).data !== null &&
    'title' in ((data as ApiErrorResponse).data as ApiErrorData) &&
    'desc' in ((data as ApiErrorResponse).data as ApiErrorData)
  )
}

/**
 * Extract API error data for display in UI (bottomsheet, toast, etc.)
 * Handles the structured error response from backend
 *
 * @example
 * onError: (error) => {
 *   const { title, description } = extractApiError(error, 'Gagal menukar hadiah')
 *   errorTitle.value = title
 *   errorMessage.value = description
 *   showErrorSheet.value = true
 * }
 */
export function extractApiError(
  error: unknown,
  fallbackTitle = 'Terjadi Kesalahan',
): ExtractedApiError {
  // Check axios-style error with response.data
  const axiosError = error as { response?: { data?: unknown } }
  const responseData = axiosError?.response?.data

  if (hasApiErrorData(responseData) && responseData.data) {
    return {
      title: responseData.data.title,
      description: responseData.data.desc,
      deeplink: responseData.data.deeplink,
    }
  }

  // Fallback to message field if no structured data
  const errorResponse = responseData as { message?: string } | undefined
  const message = errorResponse?.message || 'Terjadi kesalahan. Silakan coba lagi.'

  return {
    title: fallbackTitle,
    description: message,
  }
}

/**
 * Convert any error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof Error) {
    return { message: error.message }
  }

  if (typeof error === 'string') {
    return { message: error }
  }

  return { message: 'An unexpected error occurred' }
}

/**
 * Get error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  return toAppError(error).message
}
