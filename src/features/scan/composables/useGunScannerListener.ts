import { onBeforeUnmount, watch, type Ref } from 'vue'

// Listen for USB gun scanner: keystroke burst terminated by Enter. Buffer clears
// after 300ms inactivity to distinguish scanner (~15ms/char) from human typing.
const IGNORED_KEYS = new Set([
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'Tab',
  'Backspace',
  'Escape',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'CapsLock',
  'Home',
  'End',
])

const INACTIVITY_MS = 300

export function useGunScannerListener(enabled: Ref<boolean>, onScan: (code: string) => void) {
  let buffer = ''
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const flushBuffer = () => {
    const value = buffer.trim()
    buffer = ''
    if (value) onScan(value)
  }

  const resetTimer = () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      buffer = ''
    }, INACTIVITY_MS)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (!enabled.value) return

    // Skip keystrokes going into text inputs / textareas / editables.
    const target = event.target as HTMLElement | null
    if (target) {
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
    }

    if (IGNORED_KEYS.has(event.key)) return

    if (event.key === 'Enter') {
      event.preventDefault()
      if (timeoutId) clearTimeout(timeoutId)
      flushBuffer()
      return
    }

    if (event.key.length === 1) {
      buffer += event.key
      resetTimer()
    }
  }

  watch(
    enabled,
    active => {
      if (active) window.addEventListener('keydown', handleKeydown)
      else {
        window.removeEventListener('keydown', handleKeydown)
        buffer = ''
        if (timeoutId) clearTimeout(timeoutId)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (timeoutId) clearTimeout(timeoutId)
  })
}
