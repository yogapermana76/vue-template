<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import { TextField, TextAreaField } from '@/components/ui/form'
  import {
    RewardPrizeCard,
    RecipientInfoCard,
    RecipientInfoBottomSheet,
  } from '@/components/rewards'
  import { LocationField, type SelectedLocation } from '@/components/shared/location-picker'
  import { ConfirmationBottomSheet } from '@/components/shared'
  import {
    useLastAddress,
    useLotteryRedeem,
    useRewardExchange,
    useProvinces,
    useCities,
    useDistricts,
    useLotteryDetail,
    useRewardRedeemableDetail,
    usePointSummary,
  } from '@/composables/services'
  import { authStorage } from '@/utils/storage'
  import { formatDateRange } from '@/utils/date'
  import { formatNumber } from '@/utils/currency'
  import { extractApiError } from '@/utils'
  import { openDeeplink } from '@/utils/native-bridge'
  import type { User } from '@/types/services/auth.types'
  import MascotIllustration from '@/assets/illustrations/mascot-confirm.png'
  import PensiveMascotIllustration from '@/assets/illustrations/pensive-mascot.png'
  import DisappointedMascotIllustration from '@/assets/illustrations/disappointed-mascot.png'

  definePage({
    meta: {
      title: 'Lengkapi Alamat',
    },
  })

  const router = useRouter()
  const route = useRoute()

  // Route params
  const itemId = computed(() => (route.query.id as string) || '')
  const itemType = computed(() => (route.query.type as string) || 'lottery')
  const isLottery = computed(() => itemType.value === 'lottery')
  const isReward = computed(() => itemType.value === 'reward')

  // User profile
  const userProfile = authStorage.getUser<User>()

  // Bottom sheet states
  const showEditRecipientSheet = ref(false)
  const showConfirmationSheet = ref(false)
  const showErrorSheet = ref(false)
  const errorTitle = ref('')
  const errorDescription = ref('')
  const errorDeeplink = ref('')

  // API Queries
  const { data: lastAddressData } = useLastAddress()
  const { data: userPointsData } = usePointSummary()
  const { data: lotteryDetailData, isPending: isLotteryLoading } = useLotteryDetail({
    params: { id: itemId },
    options: { enabled: isLottery },
  })
  const { data: rewardDetailData, isPending: isRewardLoading } = useRewardRedeemableDetail({
    params: { id: itemId },
    options: { enabled: isReward },
  })

  // API Mutations
  const { mutate: redeemLottery, isPending: isRedeemingLottery } = useLotteryRedeem()
  const { mutate: exchangeReward, isPending: isExchangingReward } = useRewardExchange()

  // Derived states
  const isRedeeming = computed(() => isRedeemingLottery.value || isExchangingReward.value)
  const isLoading = computed(() =>
    isLottery.value ? isLotteryLoading.value : isRewardLoading.value,
  )
  const userPoints = computed(() => userPointsData.value?.data?.balance ?? 0)

  // Form Schema
  const redeemSchema = z.object({
    id: z.number({ required_error: 'ID diperlukan' }),
    provinceId: z.number().refine(val => val > 0, 'Provinsi harus dipilih'),
    provinceName: z.string().min(1, 'Nama provinsi diperlukan'),
    cityId: z.number().refine(val => val > 0, 'Kota harus dipilih'),
    cityName: z.string().min(1, 'Nama kota diperlukan'),
    districtId: z.number().refine(val => val > 0, 'Kecamatan harus dipilih'),
    districtName: z.string().min(1, 'Nama kecamatan diperlukan'),
    address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
    postalCode: z.string().regex(/^\d{5,6}$/, 'Kode pos harus 5-6 digit angka'),
    receivedInfo: z.object({
      fullname: z.string().min(1, 'Nama lengkap diperlukan'),
      email: z.string().email('Format email tidak valid'),
      noHp: z.string().regex(/^\d+$/, 'Nomor HP harus berupa angka'),
    }),
  })

  type RedeemFormValues = z.infer<typeof redeemSchema>

  // Helper
  const parseLocationId = (id: string | number | undefined): number => {
    if (!id) return 0
    return typeof id === 'string' ? parseInt(id, 10) : id
  }

  // Form initialization
  const getInitialFormValues = (): RedeemFormValues => {
    const lastAddress = lastAddressData.value?.data
    return {
      id: parseInt(itemId.value, 10) || 0,
      provinceId: parseLocationId(lastAddress?.provinceId),
      provinceName: lastAddress?.provinceName || '',
      cityId: parseLocationId(lastAddress?.cityId),
      cityName: lastAddress?.cityName || '',
      districtId: parseLocationId(lastAddress?.districtId),
      districtName: lastAddress?.districtName || '',
      address: lastAddress?.address || '',
      postalCode: lastAddress?.postalCode || '',
      receivedInfo: {
        fullname: userProfile?.fullname || '',
        email: userProfile?.email || '',
        noHp: userProfile?.phoneNumber || '',
      },
    }
  }

  const { handleSubmit, setFieldValue, setFieldTouched, values, resetForm } =
    useForm<RedeemFormValues>({
      validationSchema: toTypedSchema(redeemSchema),
      initialValues: getInitialFormValues(),
    })

  // Location state
  const selectedLocation = ref<SelectedLocation>()

  // Auto-fill: sync form and selectedLocation when lastAddressData loads
  watch(
    lastAddressData,
    (data, oldData) => {
      if (!data?.data) return

      const { provinceId, cityId, districtId } = data.data

      // Sync selectedLocation for LocationField
      if (provinceId && cityId && districtId) {
        selectedLocation.value = {
          provinceId: String(provinceId),
          cityId: String(cityId),
          districtId: String(districtId),
        }
      }

      // Reset form only on first load (empty -> populated)
      if (!oldData?.data) {
        resetForm({ values: getInitialFormValues() })
      }
    },
    { immediate: true },
  )

  // Region data for LocationField
  const { data: provincesData } = useProvinces()
  const { data: citiesData } = useCities({
    query: { provinceId: computed(() => selectedLocation.value?.provinceId) },
  })
  const { data: districtsData } = useDistricts({
    query: { cityId: computed(() => selectedLocation.value?.cityId) },
  })

  // Name maps for LocationField display
  const createNameMap = (
    apiData: typeof provincesData | typeof citiesData | typeof districtsData,
    fallbackId?: string | number,
    fallbackName?: string,
  ): Record<string, string> => {
    const map: Record<string, string> = {}
    apiData.value?.data?.forEach(item => {
      map[item.id] = item.name
    })
    if (fallbackId && fallbackName) {
      map[String(fallbackId)] = fallbackName
    }
    return map
  }

  const provinceNames = computed(() =>
    createNameMap(
      provincesData,
      lastAddressData.value?.data?.provinceId,
      lastAddressData.value?.data?.provinceName,
    ),
  )
  const cityNames = computed(() =>
    createNameMap(
      citiesData,
      lastAddressData.value?.data?.cityId,
      lastAddressData.value?.data?.cityName,
    ),
  )
  const districtNames = computed(() =>
    createNameMap(
      districtsData,
      lastAddressData.value?.data?.districtId,
      lastAddressData.value?.data?.districtName,
    ),
  )

  // Location error message
  const locationError = computed(() => {
    if (!values.provinceId || values.provinceId === 0) return 'Provinsi harus dipilih'
    if (!values.cityId || values.cityId === 0) return 'Kota harus dipilih'
    if (!values.districtId || values.districtId === 0) return 'Kecamatan harus dipilih'
    return undefined
  })

  // Handle location change
  const handleLocationChange = async (location: SelectedLocation | undefined) => {
    selectedLocation.value = location
    const { provinceId, cityId, districtId } = location || {}

    setFieldValue('provinceId', provinceId ? parseInt(provinceId, 10) : 0)
    setFieldValue('cityId', cityId ? parseInt(cityId, 10) : 0)
    setFieldValue('districtId', districtId ? parseInt(districtId, 10) : 0)

    await nextTick()

    setFieldValue('provinceName', provinceId ? provinceNames.value[provinceId] || '' : '')
    setFieldValue('cityName', cityId ? cityNames.value[cityId] || '' : '')
    setFieldValue('districtName', districtId ? districtNames.value[districtId] || '' : '')

    setFieldTouched('provinceId', true)
    setFieldTouched('cityId', true)
    setFieldTouched('districtId', true)
  }

  // Recipient info handlers
  const handleSaveRecipientInfo = (email: string, phone: string) => {
    setFieldValue('receivedInfo.email', email)
    setFieldValue('receivedInfo.noHp', phone)
    showEditRecipientSheet.value = false
  }

  // Prize data (unified for lottery/reward)
  const prizeData = computed(() => {
    const data = isLottery.value ? lotteryDetailData.value : rewardDetailData.value?.data
    if (!data) return { image: 'https://placehold.co/80x80', title: '', date: '' }

    return {
      image: data.imageUrl || 'https://placehold.co/80x80',
      title: data.title || '',
      date: data.startDate && data.endDate ? formatDateRange(data.startDate, data.endDate) : '',
    }
  })

  // Points check
  const requiredPoints = computed(() => {
    if (isLottery.value) return lotteryDetailData.value?.pricePoint ?? 0
    if (isReward.value) return rewardDetailData.value?.data?.pricePoint ?? 0
    return 0
  })

  const hasEnoughPoints = computed(() => userPoints.value >= requiredPoints.value)
  const disabledMessage = computed(() =>
    hasEnoughPoints.value ? null : 'Poin anda tidak mencukupi',
  )

  // Confirmation description
  const confirmationDescription = computed(() => {
    if (!requiredPoints.value) return ''
    const itemLabel = isLottery.value ? 'kupon undian ini' : 'hadiah ini'
    return `Apakah anda ingin menukarkan <strong>${formatNumber(requiredPoints.value)} poin</strong> untuk mendapatkan ${itemLabel}?`
  })

  // Error handling helper
  const handleMutationError = (error: unknown, defaultTitle: string, checkHasData = false) => {
    showConfirmationSheet.value = false
    const { title, description, deeplink, hasData } = extractApiError(error, defaultTitle)
    if (checkHasData && !hasData) return
    errorTitle.value = title
    errorDescription.value = description
    errorDeeplink.value = deeplink || ''
    showErrorSheet.value = true
  }

  // Form submission
  const handleConfirmExchange = handleSubmit(formValues => {
    errorTitle.value = ''
    errorDescription.value = ''

    const { id, ...addressFields } = formValues

    if (isLottery.value) {
      redeemLottery(
        { ...addressFields, lotteryId: id },
        {
          onSuccess: response => {
            showConfirmationSheet.value = false
            if (response.data?.tUserPointId) {
              router.replace(`/rewards/redemption/${response.data.tUserPointId}`)
            }
          },
          onError: error => handleMutationError(error, 'Gagal Menukar Undian'),
        },
      )
    } else if (isReward.value) {
      exchangeReward(
        { ...addressFields, rewardId: id },
        {
          onSuccess: response => {
            showConfirmationSheet.value = false
            if (response.data?.id) {
              router.replace(`/rewards/redemption/${response.data.id}`)
            }
          },
          onError: error => handleMutationError(error, 'Gagal Menukar Hadiah', true),
        },
      )
    }
  })

  const onSubmit = handleSubmit(() => {
    showConfirmationSheet.value = true
  })

  const handleCancelExchange = () => {
    if (!isRedeeming.value) {
      showConfirmationSheet.value = false
    }
  }

  // Error sheet
  const errorIllustration = computed(() =>
    errorTitle.value === 'Ups, hadiah sudah habis'
      ? DisappointedMascotIllustration
      : PensiveMascotIllustration,
  )

  const closeErrorSheet = () => {
    showErrorSheet.value = false
  }

  const handleVerifyAction = () => {
    if (errorDeeplink.value) {
      openDeeplink(errorDeeplink.value)
    }
    closeErrorSheet()
  }

  const verificationLabels: Record<string, string> = {
    'verifikasi email dulu, yuk!': 'Verifikasi Email',
    'verifikasi nomor hp dulu, yuk!': 'Verifikasi Nomor HP',
    'verifikasi akun dulu, yuk!': 'Verifikasi Akun',
  }

  const errorSheetButtons = computed(() => {
    const verificationLabel = verificationLabels[errorTitle.value.toLowerCase()]
    if (verificationLabel) {
      return [
        { label: verificationLabel, variant: 'primary' as const, onClick: handleVerifyAction },
        { label: 'Tutup', variant: 'secondary' as const, onClick: closeErrorSheet },
      ]
    }
    return [{ label: 'Kembali', variant: 'primary' as const, onClick: closeErrorSheet }]
  })
</script>

<template>
  <Header title="Tukar Poin" />

  <div class="pt-14 pb-36">
    <main class="flex flex-1 flex-col gap-5 pt-4 pb-6">
      <!-- Prize Card -->
      <div class="px-4">
        <RewardPrizeCard :image="prizeData.image" :title="prizeData.title" :date="prizeData.date" />
      </div>

      <Divider thick class="w-full bg-neutral-50" />

      <!-- Informasi Penerima -->
      <div class="flex w-full flex-col gap-3 px-4">
        <h2 class="body-l-semibold text-slate-950">Informasi Penerima</h2>
        <RecipientInfoCard
          :name="values.receivedInfo.fullname"
          :email="values.receivedInfo.email"
          :phone="values.receivedInfo.noHp"
          @click="showEditRecipientSheet = true"
        />
      </div>

      <Divider thick class="w-full bg-neutral-50" />

      <!-- Alamat Pengiriman -->
      <div class="flex w-full flex-col gap-3 px-4">
        <h2 class="body-l-semibold text-slate-950">Alamat Pengiriman</h2>
        <p class="body-caption text-slate-700">
          Hadiah akan dikirimkan ke alamat yang dimasukkan. Barang yang gagal kirim karena alamat
          tidak lengkap menjadi tanggungjawab pelanggan/
        </p>

        <div class="flex flex-col gap-4">
          <!-- Alamat Lengkap -->
          <Field name="address" v-slot="{ field, meta: fieldMeta, errorMessage }">
            <TextAreaField
              :model-value="field.value"
              label="Alamat Lengkap"
              placeholder="Jl. Kh Ahmad"
              required
              :rows="4"
              resize="none"
              :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </Field>

          <!-- Lokasi -->
          <Field name="districtId" v-slot="{ field, meta: fieldMeta }">
            <LocationField
              v-model="selectedLocation"
              label="Provinsi/Kota/Kecamatan"
              placeholder="Pilih Provinsi/Kota/Kecamatan"
              picker-title="Provinsi, Kota, Kecamatan"
              :province-names="provinceNames"
              :city-names="cityNames"
              :district-names="districtNames"
              required
              :error="fieldMeta.touched && locationError ? locationError : undefined"
              @change="
                location => {
                  handleLocationChange(location)
                  field.onChange(location?.districtId ? parseInt(location.districtId, 10) : 0)
                }
              "
            />
          </Field>

          <!-- Kode Pos -->
          <Field name="postalCode" v-slot="{ field, meta: fieldMeta, errorMessage }">
            <TextField
              :model-value="field.value"
              label="Kode Pos"
              placeholder="10114"
              type="text"
              required
              :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </Field>
        </div>
      </div>
    </main>
  </div>

  <!-- Footer -->
  <Footer v-if="!isLoading" position="fixed">
    <div v-if="disabledMessage">
      <p class="body-m text-slate-950">{{ disabledMessage }}</p>
    </div>
    <Button
      variant="primary"
      size="md"
      class="w-full"
      :disabled="!hasEnoughPoints"
      :loading="isRedeeming"
      @click="onSubmit"
    >
      Tukar Poin
    </Button>
  </Footer>

  <!-- Bottom Sheets -->
  <RecipientInfoBottomSheet
    v-model:open="showEditRecipientSheet"
    :email="values.receivedInfo.email"
    :phone="values.receivedInfo.noHp"
    @save="handleSaveRecipientInfo"
  />

  <ConfirmationBottomSheet
    v-model:open="showConfirmationSheet"
    :image="MascotIllustration"
    title="Menukarkan hadiah?"
    :description="confirmationDescription"
    button-layout="row"
    :buttons="[
      { label: 'Kembali', variant: 'secondary', onClick: handleCancelExchange },
      {
        label: 'Tukar Poin',
        variant: 'primary',
        loading: isRedeeming,
        onClick: handleConfirmExchange,
      },
    ]"
  />

  <ConfirmationBottomSheet
    v-model:open="showErrorSheet"
    :image="errorIllustration"
    :title="errorTitle"
    :description="errorDescription"
    button-layout="column"
    :buttons="errorSheetButtons"
  />
</template>
