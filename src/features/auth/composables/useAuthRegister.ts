import { ref } from 'vue'
import type { RegisterValues } from '../types'
import { extractAuthError } from '../utils/extractAuthError'

export function useAuthRegister() {
  const submitting = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  const submit = async (_values: RegisterValues) => {
    submitting.value = true
    error.value = null
    try {
      await new Promise(r => setTimeout(r, 700))
      success.value = true
    } catch (e) {
      error.value = extractAuthError(e, 'Failed to register')
    } finally {
      submitting.value = false
    }
  }

  return { submitting, success, error, submit }
}
