// Booking state persistence with manual sessionStorage

import { watch, type Ref } from 'vue'

interface FormInstance {
  values: Record<string, any>
  setValues: (values: Record<string, any>) => void
}

interface BookingState {
  currentStep: number
  ticketSelectionData: Record<string, any>
  orderInfoData: Record<string, any>
  paymentData: Record<string, any>
}

interface UseBookingOptions {
  eventId: Ref<string>
  currentStep: Ref<number>
  forms: {
    ticketSelection: FormInstance
    orderInfo: FormInstance
    payment: FormInstance
  }
}

export function useBooking(options: UseBookingOptions) {
  const { eventId, currentStep, forms } = options

  // Get storage key for current event
  function getStorageKey(): string {
    return `lifestyle_booking_state_${eventId.value}`
  }

  // Save state to sessionStorage
  function saveState() {
    const state: BookingState = {
      currentStep: currentStep.value,
      ticketSelectionData: forms.ticketSelection.values,
      orderInfoData: forms.orderInfo.values,
      paymentData: forms.payment.values,
    }

    try {
      sessionStorage.setItem(getStorageKey(), JSON.stringify(state))
    } catch (error) {
      console.error('[useBooking] Failed to save:', error)
    }
  }

  // Load state from sessionStorage
  function loadState(): BookingState | null {
    try {
      const stored = sessionStorage.getItem(getStorageKey())
      if (!stored) return null

      return JSON.parse(stored) as BookingState
    } catch (error) {
      console.error('[useBooking] Failed to load:', error)
      return null
    }
  }

  // Restore state from storage
  function restore() {
    const savedState = loadState()

    if (savedState && savedState.currentStep) {
      currentStep.value = savedState.currentStep
      forms.ticketSelection.setValues(savedState.ticketSelectionData)
      forms.orderInfo.setValues(savedState.orderInfoData)
      forms.payment.setValues(savedState.paymentData)
    }
  }

  /**
   * Clear booking state from storage
   */
  function clear() {
    sessionStorage.removeItem(getStorageKey())
  }

  // Auto-save on step changes
  watch(currentStep, saveState)

  // Auto-save on form value changes
  watch(
    () => [forms.ticketSelection.values, forms.orderInfo.values, forms.payment.values],
    saveState,
    { deep: true },
  )

  return {
    restore,
    clear,
    saveState, // Export for manual save if needed
  }
}
