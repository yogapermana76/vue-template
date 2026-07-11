export function extractAuthError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const anyErr = err as {
      response?: { data?: { message?: string; Message?: string } }
      message?: string
    }
    return (
      anyErr.response?.data?.message ?? anyErr.response?.data?.Message ?? anyErr.message ?? fallback
    )
  }
  return fallback
}
