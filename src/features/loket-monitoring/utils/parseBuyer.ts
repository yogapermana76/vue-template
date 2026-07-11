export interface BuyerInfo {
  fullname: string
  phoneNumber: string
  email: string
}

export function parseBuyer(value: unknown): BuyerInfo {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const v = value as Record<string, unknown>
    return {
      fullname: String(v.fullname ?? v.Fullname ?? '') || '',
      phoneNumber: String(v.phoneNumber ?? v.PhoneNumber ?? '') || '',
      email: String(v.email ?? v.Email ?? '') || '',
    }
  }
  return { fullname: '', phoneNumber: '', email: '' }
}
