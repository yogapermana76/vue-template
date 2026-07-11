import { computed, ref } from 'vue'
import { loketTicketService } from '@/services/loket'
import { useLoketClaimTicket } from '@/composables/services/loket'
import type { LoketScanResult } from '@/types/services/loket'
import type { ScanHistoryEntry, ScanOutcome, ScanState } from '../types'
import { isScanResultValid } from '../utils/isScanResultValid'

export function useLoketScan(programIdRef: () => number | undefined) {
  const state = ref<ScanState>('idle')
  const cameraActive = ref(false)
  const outcome = ref<ScanOutcome | null>(null)
  const outcomeMessage = ref<string | null>(null)
  const history = ref<ScanHistoryEntry[]>([])

  const claimMutation = useLoketClaimTicket()
  const isClaiming = computed(() => claimMutation.isPending.value)

  // Prevent double-processing the same code fired repeatedly by the camera.
  let inflightCode: string | null = null

  const startCamera = () => {
    if (!programIdRef()) {
      setError('Pilih program terlebih dahulu sebelum memulai scan.')
      return
    }
    outcome.value = null
    outcomeMessage.value = null
    state.value = 'scanning'
    cameraActive.value = true
  }

  const stopCamera = () => {
    cameraActive.value = false
    if (state.value === 'scanning') state.value = 'idle'
  }

  const setError = (message: string) => {
    outcomeMessage.value = message
    state.value = 'error'
  }

  const verifyCode = async (code: string) => {
    const programId = programIdRef()
    if (!code || !programId) return
    if (inflightCode === code) return
    inflightCode = code

    cameraActive.value = false
    state.value = 'verifying'
    outcome.value = { code }

    try {
      const scanResponse = await loketTicketService.scanTicket({ code })
      const scanResult: LoketScanResult | undefined = scanResponse.data

      outcome.value = { code, scanResult, statusCode: 200 }
      state.value = 'list'
      const validForClaim = isScanResultValid(scanResult)
      appendHistory({
        code,
        timestamp: Date.now(),
        status: validForClaim ? 'valid' : 'invalid',
        message: validForClaim ? 'Tiket valid' : 'Tiket tidak valid',
      })
    } catch (err) {
      // Route server + network failures through the same extractor so the outcome
      // dialog picks the right mascot (404 → pensive, 400/network → disappointed).
      const failure = extractServerFailure(err)
      const msg = failure?.message ?? 'Gagal memverifikasi tiket. Periksa koneksi Anda.'
      outcome.value = {
        code,
        statusCode: failure?.statusCode,
        serverMessage: failure?.message,
        errorMessage: msg,
      }
      outcomeMessage.value = msg
      state.value = 'error'
      appendHistory({
        code,
        timestamp: Date.now(),
        status: failure?.statusCode === 404 ? 'error' : 'invalid',
        message: msg,
      })
    } finally {
      inflightCode = null
    }
  }

  const handleDetect = (code: string) => {
    void verifyCode(code)
  }

  const submitManual = (code: string) => {
    if (!programIdRef()) {
      setError('Pilih program terlebih dahulu.')
      return
    }
    void verifyCode(code.trim().toUpperCase())
  }

  const requestConfirmation = () => {
    if (state.value !== 'list') return
    state.value = 'confirming'
  }

  const cancelConfirmation = () => {
    if (state.value !== 'confirming') return
    state.value = 'list'
  }

  // Partial success ("some succeeded") counts as overall success.
  const confirmClaim = async (codes?: string[]) => {
    const target =
      codes && codes.length > 0 ? codes : outcome.value?.code ? [outcome.value.code] : []
    if (target.length === 0) return

    state.value = 'claiming'
    try {
      const res = await claimMutation.mutateAsync({ Codes: target })
      const successCodes = res.data?.SuccessCodes ?? []
      const failedCodes = res.data?.FailedCodes ?? []

      if (successCodes.length > 0) {
        outcome.value = {
          ...(outcome.value ?? { code: target[0] }),
          successCodes,
          failedCodes,
        }

        // Partial success needs an explicit summary; generic "Berhasil" hides failures.
        outcomeMessage.value =
          failedCodes.length > 0
            ? `${successCodes.length} tiket berhasil diklaim, ${failedCodes.length} gagal.`
            : (res.message ?? 'Berhasil klaim tiket')

        state.value = 'success'

        successCodes.forEach(code => {
          appendHistory({
            code,
            timestamp: Date.now(),
            status: 'claimed',
            message: 'Berhasil diklaim',
          })
        })
        failedCodes.forEach(code => {
          appendHistory({
            code,
            timestamp: Date.now(),
            status: 'error',
            message: 'Gagal diklaim',
          })
        })
      } else {
        // Zero success — treat as claim error but keep the breakdown for the dialog.
        outcome.value = {
          ...(outcome.value ?? { code: target[0] }),
          successCodes: [],
          failedCodes,
        }
        failedCodes.forEach(code => {
          appendHistory({
            code,
            timestamp: Date.now(),
            status: 'error',
            message: 'Gagal diklaim',
          })
        })
        const msg =
          failedCodes.length > 0
            ? `${failedCodes.length} tiket gagal diklaim.`
            : (res.message ?? 'Klaim tiket gagal. Periksa status tiket dan coba lagi.')
        setError(msg)
      }
    } catch (err) {
      const serverMsg = extractServerFailure(err)?.message
      setError(serverMsg ?? 'Klaim tiket gagal karena kesalahan jaringan.')
    }
  }

  const scanNext = () => {
    outcome.value = null
    outcomeMessage.value = null
    state.value = 'scanning'
    cameraActive.value = true
  }

  const reset = () => {
    outcome.value = null
    outcomeMessage.value = null
    state.value = 'idle'
    cameraActive.value = false
  }

  function appendHistory(entry: ScanHistoryEntry) {
    history.value = [entry, ...history.value].slice(0, 20)
  }

  function extractServerFailure(
    reason: unknown,
  ): { statusCode?: number; message?: string } | undefined {
    if (!reason || typeof reason !== 'object') return undefined
    const r = reason as {
      response?: { status?: number; data?: { statusCode?: number; message?: string } }
      isBusinessError?: boolean
      message?: string
    }
    const bodyStatus = r.response?.data?.statusCode
    const httpStatus = r.response?.status
    const message = r.response?.data?.message ?? r.message
    const statusCode = bodyStatus ?? httpStatus
    if (statusCode === undefined && !message) return undefined
    return { statusCode, message }
  }

  return {
    state,
    cameraActive,
    outcome,
    outcomeMessage,
    history,
    isClaiming,
    canConfirmClaim: computed(
      () => state.value === 'list' && isScanResultValid(outcome.value?.scanResult),
    ),
    startCamera,
    stopCamera,
    handleDetect,
    submitManual,
    requestConfirmation,
    cancelConfirmation,
    confirmClaim,
    scanNext,
    reset,
  }
}
