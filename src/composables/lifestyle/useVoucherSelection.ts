import { useRouter, useRoute } from 'vue-router'
import { useVoucherStore, type SelectedVoucher } from '@/stores/lifestyle/voucher'
import { storeToRefs } from 'pinia'

export type { SelectedVoucher }

export function useVoucherSelection() {
  const router = useRouter()
  const route = useRoute()
  const voucherStore = useVoucherStore()

  const { selectedVoucher, hasVoucher } = storeToRefs(voucherStore)

  function openVoucherSelection() {
    const currentPath = route.fullPath
    router.replace({
      path: '/lifestyle/vouchers',
      query: { from: currentPath },
    })
  }

  function applyVoucher(voucher: SelectedVoucher) {
    voucherStore.setVoucher(voucher)
    const fromPath = route.query.from as string
    if (fromPath) {
      router.replace(fromPath)
    }
  }

  function goBack() {
    const fromPath = route.query.from as string
    if (fromPath) {
      router.replace(fromPath)
    }
  }

  function clearVoucher() {
    voucherStore.clearVoucher()
  }

  return {
    selectedVoucher,
    hasVoucher,
    openVoucherSelection,
    applyVoucher,
    goBack,
    clearVoucher,
  }
}
