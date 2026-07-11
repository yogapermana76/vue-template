import { z } from 'zod'
import { scorePassword } from '../constants'

export function passwordAndConfirmFields() {
  return {
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(v => scorePassword(v) >= 2, 'Password is too weak'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  }
}

// Separate fields (not `as const` tuple) so `path` stays mutable for Zod's `.refine`.
export const matchPasswords = {
  check: (d: { password: string; confirmPassword: string }) => d.password === d.confirmPassword,
  options: { path: ['confirmPassword'], message: 'Passwords do not match' },
}

export function passwordConfirmSchema() {
  return z.object(passwordAndConfirmFields()).refine(matchPasswords.check, matchPasswords.options)
}
