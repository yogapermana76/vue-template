import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/utils/storage/keys'

const STORAGE_KEY = STORAGE_KEYS.LAST_PROGRAM_ID

// Hydrate from sessionStorage so a page reload (or opening the scan flow from
// a program-less page like /voucher-submission) still remembers the last pick.
const readStoredProgramId = (): number | undefined => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const n = Number(raw)
    return Number.isFinite(n) ? n : undefined
  } catch {
    return undefined
  }
}

const writeStoredProgramId = (id: number | undefined) => {
  try {
    if (id === undefined) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, String(id))
  } catch {
    /* sessionStorage unavailable — ignore. */
  }
}

// Module-level singleton so any component can trigger the scan dialog.
const _open = ref(false)
const _programId = ref<number | undefined>(readStoredProgramId())

export function useScanModal() {
  const openScan = (programId?: number) => {
    if (programId !== undefined) {
      _programId.value = programId
      writeStoredProgramId(programId)
    }
    _open.value = true
  }

  const closeScan = () => {
    _open.value = false
  }

  const setProgramId = (programId: number | undefined) => {
    _programId.value = programId
    writeStoredProgramId(programId)
  }

  return {
    isOpen: computed(() => _open.value),
    programId: computed(() => _programId.value),
    open: _open,
    openScan,
    closeScan,
    setProgramId,
  }
}
