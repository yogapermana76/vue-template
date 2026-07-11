import type { PasswordStrength } from './types'

export const scorePassword = (password: string): PasswordStrength => {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++
  return Math.min(4, score) as PasswordStrength
}

export const strengthLabels: Record<PasswordStrength, string> = {
  0: 'Too short',
  1: 'Weak',
  2: 'Fair',
  3: 'Strong',
  4: 'Excellent',
}

export const strengthTones: Record<PasswordStrength, string> = {
  0: 'bg-neutral-200 text-neutral-500',
  1: 'bg-error-500 text-error-700',
  2: 'bg-warning-500 text-warning-800',
  3: 'bg-success-400 text-success-700',
  4: 'bg-success-600 text-success-800',
}
