import { ref } from 'vue'
import { STORAGE_KEYS } from '@/utils/storage/keys'

const STORAGE_KEY = STORAGE_KEYS.LAST_PROGRAM_ID

const readStored = (): number | undefined => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const n = Number(raw)
    return Number.isFinite(n) ? n : undefined
  } catch {
    return undefined
  }
}

const writeStored = (id: number | undefined) => {
  try {
    if (id === undefined) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, String(id))
  } catch {
    /* sessionStorage unavailable — ignore. */
  }
}

// Module-level singleton so every page sees the same selection.
const _selectedProgramId = ref<number | undefined>(readStored())

export function useSelectedProgram() {
  const setSelectedProgramId = (id: number | undefined) => {
    _selectedProgramId.value = id
    writeStored(id)
  }

  return {
    selectedProgramId: _selectedProgramId,
    setSelectedProgramId,
  }
}
