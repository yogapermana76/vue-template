import { computed, ref } from 'vue'

// Push/pop navigation model. Each entry is a key the caller uses to switch
// view templates via v-if. Surface-agnostic — works for any stacked overlay
// (side-sheet, bottom-sheet, dialog, wizard steps, etc.).
export function useNavStack<K extends string>(root: K) {
  const stack = ref<K[]>([]) as { value: K[] }

  const openRoot = () => {
    stack.value = [root]
  }
  const close = () => {
    stack.value = []
  }
  const push = (key: K) => {
    if (stack.value[stack.value.length - 1] === key) return
    stack.value = [...stack.value, key]
  }
  const pop = () => {
    if (stack.value.length <= 1) return
    stack.value = stack.value.slice(0, -1)
  }

  const current = computed<K | undefined>(() => stack.value[stack.value.length - 1])
  const depth = computed(() => stack.value.length)
  const isOpen = computed(() => stack.value.length > 0)

  const isActive = (key: K) => current.value === key
  const isMounted = (key: K) => stack.value.includes(key)

  return {
    stack,
    current,
    depth,
    isOpen,
    isActive,
    isMounted,
    openRoot,
    close,
    push,
    pop,
  }
}
