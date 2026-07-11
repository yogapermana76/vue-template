import { ref } from 'vue'
import { extractAuthError } from '../utils/extractAuthError'

export function useAuthReset() {
  const submitting = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  const submit = async (_token: string, _password: string) => {
    submitting.value = true
    error.value = null
    try {
      await new Promise(r => setTimeout(r, 700))
      success.value = true
    } catch (e) {
      error.value = extractAuthError(e, 'Failed to reset password')
    } finally {
      submitting.value = false
    }
  }

  const reset = () => {
    success.value = false
    error.value = null
  }

  return { submitting, success, error, submit, reset }
}
