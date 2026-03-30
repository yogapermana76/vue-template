/**
 * Error Handling
 *
 * Simple error utilities tanpa custom classes.
 */

export interface AppError {
  message: string
  code?: string
  status?: number
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
