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
  import { RewardPrizeCard, RecipientInfoCard } from '@/components/rewards'
  import { RecipientInfoBottomSheet } from '@/components/rewards'
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
  import MascotIllustration from '@/assets/illustrations/mascot.svg?component'
  import PensiveMascotIllustration from '@/assets/illustrations/pensive-mascot.svg?component'
  import DisappointedMascotIllustration from '@/assets/illustrations/disappointed-mascot.svg?component'

  definePage({
    meta: {
      title: 'Lengkapi Alamat',
    },
  })

  const router = useRouter()
  const route = useRoute()

  // ============================================
  // Confirmation & Error State
  // ============================================
  const showErrorSheet = ref(false)
  const errorTitle = ref('')
  const errorDescription = ref('')
  const errorDeeplink = ref('')

  // ============================================
  // Route & User Data
  // ============================================

  // Get ID and type from query params
  const itemId = computed(() => {
    const id = route.query.id as string | undefined
    return id || ''
  })

  const itemType = computed(() => {
    const type = route.query.type as string | undefined
    return type || 'lottery' // default to lottery for backward compatibility
  })

  const isLottery = computed(() => itemType.value === 'lottery')
  const isReward = computed(() => itemType.value === 'reward')

  const userProfile = authStorage.getUser<User>()

  // ============================================
  // API Queries & Mutations
  // ============================================

  const { data: lastAddressData } = useLastAddress()

  // Fetch user points
  const { data: userPointsData } = usePointSummary()

  // Fetch detail based on type
  const { data: lotteryDetailData, isPending: isLotteryLoading } = useLotteryDetail({
    params: { id: itemId },
    options: { enabled: isLottery },
  })
  const { data: rewardDetailData, isPending: isRewardLoading } = useRewardRedeemableDetail({
    params: { id: itemId },
    options: { enabled: isReward },
  })

  const { mutate: redeemLottery, isPending: isRedeemingLottery } = useLotteryRedeem()
  const { mutate: exchangeReward, isPending: isExchangingReward } = useRewardExchange()

  const isRedeeming = computed(() => isRedeemingLottery.value || isExchangingReward.value)

  // Check if data is still loading
  const isLoading = computed(() => {
    if (isLottery.value) return isLotteryLoading.value
    if (isReward.value) return isRewardLoading.value
    return false
  })

  // ============================================
  // Form Schema & Validation
  // ============================================

  /**
   * Zod validation schema matching backend request body structure
   * All location fields (provinceId, cityId, districtId) use number type
   * Uses generic 'id' field that works for both lottery and reward
   */
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

  // ============================================
  // Form Initialization
  // ============================================

  const { handleSubmit, setFieldValue, setFieldTouched, values, resetForm } =
    useForm<RedeemFormValues>({
      validationSchema: toTypedSchema(redeemSchema),
      initialValues: {
        id: parseInt(itemId.value, 10) || 0,
        provinceId: 0, // 0 = not selected
        provinceName: '',
        cityId: 0,
        cityName: '',
        districtId: 0,
        districtName: '',
        address: '',
        postalCode: '',
        receivedInfo: {
          fullname: userProfile?.fullname || '',
          email: userProfile?.email || '',
          noHp: userProfile?.phoneNumber || '',
        },
      },
    })

  // ============================================
  // Helpers
  // ============================================

  /**
   * Parse location ID to number (API may return string or number)
   * Returns 0 if invalid (represents "not selected" state)
   */
  const parseLocationId = (id: string | number | undefined): number => {
    if (!id) return 0
    return typeof id === 'string' ? parseInt(id, 10) : id
  }

  // ============================================
  // Location Selection State & Handlers
  // ============================================

  const selectedLocation = ref<SelectedLocation>()

  // ============================================
  // Auto-fill from Last Address
  // ============================================

  /**
   * Populate form with last used address data
   * Uses resetForm for declarative batch updates (better than multiple setFieldValue calls)
   */
  watch(
    lastAddressData,
    async data => {
      if (!data?.data) return

      const {
        address,
        postalCode,
        provinceId,
        provinceName,
        cityId,
        cityName,
        districtId,
        districtName,
      } = data.data

      // Update selectedLocation first to trigger dependent API queries (cities/districts)
      if (provinceId && cityId && districtId) {
        selectedLocation.value = {
          provinceId: String(provinceId),
          cityId: String(cityId),
          districtId: String(districtId),
        }
      }

      // Wait for Field components to mount and API queries to trigger
      await nextTick()

      // Batch update all form fields using resetForm (more efficient than individual setFieldValue)
      resetForm({
        values: {
          id: parseInt(itemId.value, 10) || 0,
          address: address || '',
          postalCode: postalCode || '',
          provinceId: parseLocationId(provinceId),
          provinceName: provinceName || '',
          cityId: parseLocationId(cityId),
          cityName: cityName || '',
          districtId: parseLocationId(districtId),
          districtName: districtName || '',
          receivedInfo: {
            fullname: userProfile?.fullname || '',
            email: userProfile?.email || '',
            noHp: userProfile?.phoneNumber || '',
          },
        },
      })
    },
    { immediate: true },
  )

  /**
   * Handle location change from LocationPicker
   * Converts SelectedLocation (string IDs) to form values (number IDs + names)
   */
  const handleLocationChange = async (location: SelectedLocation | undefined) => {
    selectedLocation.value = location
    const { provinceId, cityId, districtId } = location || {}

    // Set IDs immediately (convert string to number)
    setFieldValue('provinceId', provinceId ? parseInt(provinceId, 10) : 0)
    setFieldValue('cityId', cityId ? parseInt(cityId, 10) : 0)
    setFieldValue('districtId', districtId ? parseInt(districtId, 10) : 0)

    // Wait for next tick to allow computed name maps to update from API data
    await nextTick()

    // Set names from the updated name maps
    setFieldValue('provinceName', provinceId ? provinceNames.value[provinceId] || '' : '')
    setFieldValue('cityName', cityId ? cityNames.value[cityId] || '' : '')
    setFieldValue('districtName', districtId ? districtNames.value[districtId] || '' : '')

    // Mark fields as touched to enable validation
    setFieldTouched('provinceId', true)
    setFieldTouched('cityId', true)
    setFieldTouched('districtId', true)
  }

  /**
   * Computed error message for LocationField
   * Shows the most specific missing field (district > city > province)
   */
  const locationError = computed(() => {
    if (!values.provinceId || values.provinceId === 0) return 'Provinsi harus dipilih'
    if (!values.cityId || values.cityId === 0) return 'Kota harus dipilih'
    if (!values.districtId || values.districtId === 0) return 'Kecamatan harus dipilih'
    return undefined
  })

  // ============================================
  // Region Data & Name Maps
  // ============================================

  // Fetch region data for LocationPicker
  const { data: provincesData } = useProvinces()
  const { data: citiesData } = useCities({
    query: { provinceId: computed(() => selectedLocation.value?.provinceId) },
  })
  const { data: districtsData } = useDistricts({
    query: { cityId: computed(() => selectedLocation.value?.cityId) },
  })

  /**
   * Create name maps for LocationField display
   * Merges API data with lastAddress data for immediate availability on initial load
   */
  const createNameMap = (
    apiData: typeof provincesData | typeof citiesData | typeof districtsData,
    lastAddressId?: string | number,
    lastAddressName?: string,
  ) => {
    const map: Record<string, string> = {}

    // Add all names from API response
    apiData.value?.data?.forEach(item => {
      map[item.id] = item.name
    })

    // Add name from lastAddress as fallback (ensures name available before API loads)
    if (lastAddressId && lastAddressName) {
      map[String(lastAddressId)] = lastAddressName
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

  // ============================================
  // Recipient Info Section
  // ============================================

  const showEditRecipientSheet = ref(false)
  const showConfirmationSheet = ref(false)

  const recipientData = computed(() => values.receivedInfo)

  const handleRecipientClick = () => {
    showEditRecipientSheet.value = true
  }

  const handleSaveRecipientInfo = (email: string, phone: string) => {
    setFieldValue('receivedInfo.email', email)
    setFieldValue('receivedInfo.noHp', phone)
    showEditRecipientSheet.value = false
  }

  // ============================================
  // Prize Data from Detail (Lottery or Reward)
  // ============================================

  const prizeData = computed(() => {
    const lottery = lotteryDetailData.value
    const reward = rewardDetailData.value?.data

    if (isLottery.value && lottery) {
      return {
        image: lottery.imageUrl || 'https://placehold.co/80x80',
        title: lottery.title || '',
        date:
          lottery.startDate && lottery.endDate
            ? formatDateRange(lottery.startDate, lottery.endDate)
            : '',
      }
    }

    if (isReward.value && reward) {
      return {
        image: reward.imageUrl || 'https://placehold.co/80x80',
        title: reward.title || '',
        date:
          reward.startDate && reward.endDate
            ? formatDateRange(reward.startDate, reward.endDate)
            : '',
      }
    }

    return {
      image: 'https://placehold.co/80x80',
      title: '',
      date: '',
    }
  })

  // ============================================
  // Points Check
  // ============================================

  const userPoints = computed(() => userPointsData.value?.data?.balance ?? 0)

  // Check if user has enough points
  const hasEnoughPoints = computed(() => {
    const lottery = lotteryDetailData.value
    const reward = rewardDetailData.value?.data

    if (isLottery.value && lottery) {
      return userPoints.value >= (lottery.pricePoint ?? 0)
    }

    if (isReward.value && reward) {
      return userPoints.value >= (reward.pricePoint ?? 0)
    }

    return true
  })

  // Footer message for disabled state
  const disabledMessage = computed(() => {
    if (!hasEnoughPoints.value) {
      return 'Poin anda tidak mencukupi'
    }
    return null
  })

  // ============================================
  // Confirmation Bottom Sheet
  // ============================================

  const confirmationDescription = computed(() => {
    if (isLottery.value) {
      const lottery = lotteryDetailData.value
      if (!lottery) return ''
      return `Apakah anda ingin menukarkan <strong>${formatNumber(lottery.pricePoint ?? 0)} poin</strong> untuk mendapatkan kupon undian ini?`
    }

    if (isReward.value) {
      const reward = rewardDetailData.value?.data
      if (!reward) return ''
      return `Apakah anda ingin menukarkan <strong>${formatNumber(reward.pricePoint ?? 0)} poin</strong> untuk mendapatkan hadiah ini?`
    }

    return ''
  })

  const handleShowConfirmation = () => {
    showConfirmationSheet.value = true
  }

  const handleCancelExchange = () => {
    // Only allow cancel if not processing mutation
    if (!isRedeeming.value) {
      showConfirmationSheet.value = false
    }
  }

  const handleConfirmExchange = handleSubmit(formValues => {
    // Reset error state before submission
    errorTitle.value = ''
    errorDescription.value = ''
    // Don't close confirmation sheet - keep it open until mutation completes

    // Destructure to separate id from other fields
    const { id, ...addressFields } = formValues

    if (isLottery.value) {
      // Transform form values to lottery redeem request
      const lotteryRequest = {
        ...addressFields,
        lotteryId: id,
      }
      redeemLottery(lotteryRequest, {
        onSuccess: response => {
          // Only close sheet on success
          showConfirmationSheet.value = false
          const tUserPointId = response.data?.tUserPointId
          if (tUserPointId) {
            router.replace(`/rewards/redemption/${tUserPointId}`)
          }
        },
        onError: (error: unknown) => {
          showConfirmationSheet.value = false
          const { title, description, deeplink } = extractApiError(error, 'Gagal Menukar Undian')
          errorTitle.value = title
          errorDescription.value = description
          errorDeeplink.value = deeplink || ''
          showErrorSheet.value = true
        },
      })
    } else if (isReward.value) {
      // Transform form values to reward exchange request
      const rewardRequest = {
        ...addressFields,
        rewardId: id,
      }
      exchangeReward(rewardRequest, {
        onSuccess: response => {
          // Only close sheet on success
          showConfirmationSheet.value = false
          const redemptionId = response.data?.id
          if (redemptionId) {
            router.replace(`/rewards/redemption/${redemptionId}`)
          }
        },
        onError: (error: unknown) => {
          showConfirmationSheet.value = false
          const { title, description, deeplink } = extractApiError(error, 'Gagal Menukar Hadiah')
          errorTitle.value = title
          errorDescription.value = description
          errorDeeplink.value = deeplink || ''
          showErrorSheet.value = true
        },
      })
    }
  })

  // ============================================
  // Form Submission
  // ============================================

  const onSubmit = handleSubmit(() => {
    handleShowConfirmation()
  })

  const handleButtonClick = async () => {
    // Trigger validation by attempting to submit
    await onSubmit()
  }

  // ============================================
  // Error Illustration
  // ============================================

  const errorIllustration = computed(() => {
    if (errorTitle.value === 'Ups, hadiah sudah habis') {
      return DisappointedMascotIllustration
    }
    return PensiveMascotIllustration
  })

  // Handle email verification redirect
  const handleVerifyEmail = () => {
    if (errorDeeplink.value) {
      openDeeplink(errorDeeplink.value)
    }
    showErrorSheet.value = false
  }

  // Close error sheet handler
  const handleCloseError = (): void => {
    showErrorSheet.value = false
  }

  // Lowercase error title for case-insensitive comparison
  const errorTitleLower = computed(() => errorTitle.value.toLowerCase())

  // Verification error titles to button labels map
  const verificationLabels: Record<string, string> = {
    'verifikasi email dulu, yuk!': 'Verifikasi Email',
    'verifikasi nomor hp dulu, yuk!': 'Verifikasi Nomor HP',
  }

  // Dynamic error bottom sheet buttons
  const errorSheetButtons = computed(() => {
    const verificationLabel = verificationLabels[errorTitleLower.value]

    if (verificationLabel) {
      return [
        {
          label: verificationLabel,
          variant: 'primary' as const,
          onClick: handleVerifyEmail,
        },
        {
          label: 'Tutup',
          variant: 'secondary' as const,
          onClick: handleCloseError,
        },
      ]
    }

    return [
      {
        label: 'Kembali',
        variant: 'primary' as const,
        onClick: handleCloseError,
      },
    ]
  })
</script>

<template>
  <!-- Header -->
  <Header title="Tukar Poin" />

  <!-- Content with Fixed Header Gap and Footer Padding -->
  <div class="pt-14 pb-36">
    <!-- Main Content -->
    <main class="flex flex-1 flex-col gap-5 pt-4 pb-6">
      <!-- Prize Card -->
      <div class="px-4">
        <RewardPrizeCard :image="prizeData.image" :title="prizeData.title" :date="prizeData.date" />
      </div>

      <!-- Divider with background -->
      <Divider thick class="w-full bg-neutral-50" />

      <!-- Informasi Penerima Section -->
      <div class="flex w-full flex-col gap-3 px-4">
        <h2 class="body-l-semibold text-slate-950">Informasi Penerima</h2>

        <RecipientInfoCard
          :name="recipientData.fullname"
          :email="recipientData.email"
          :phone="recipientData.noHp"
          @click="handleRecipientClick"
        />
      </div>

      <!-- Divider with background -->
      <Divider thick class="w-full bg-neutral-50" />

      <!-- Alamat Pengiriman Section -->
      <div class="flex w-full flex-col gap-3 px-4">
        <h2 class="body-l-semibold text-slate-950">Alamat Pengiriman</h2>

        <p class="body-caption text-slate-700">
          Hadiah akan dikirimkan ke alamat yang dimasukkan. Barang yang gagal kirim karena alamat
          tidak lengkap menjadi tanggungjawab pelanggan/
        </p>

        <!-- Form Fields -->
        <div class="flex flex-col gap-4">
          <!-- Full Address -->
          <Field name="address" v-slot="{ field, meta: fieldMeta, errorMessage }">
            <TextAreaField
              :model-value="field.value"
              label="Alamat Lengkap"
              placeholder="Jl. Kh Ahmad"
              required
              :rows="4"
              resize="none"
              :error="fieldMeta.touched && !!errorMessage ? errorMessage : undefined"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </Field>

          <!-- City/District - Using LocationField -->
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
                  const districtId = location?.districtId ? parseInt(location.districtId, 10) : 0
                  field.onChange(districtId)
                }
              "
            />
          </Field>

          <!-- Postal Code -->
          <Field name="postalCode" v-slot="{ field, meta: fieldMeta, errorMessage }">
            <TextField
              :model-value="field.value"
              label="Kode Pos"
              placeholder="10114"
              type="text"
              required
              :error="fieldMeta.touched && !!errorMessage ? errorMessage : undefined"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </Field>
        </div>
      </div>
    </main>
  </div>

  <!-- Footer with Button -->
  <Footer v-if="!isLoading" position="fixed">
    <!-- Disabled state message -->
    <div v-if="disabledMessage">
      <p class="body-m text-slate-950">{{ disabledMessage }}</p>
    </div>

    <!-- Button -->
    <Button
      variant="primary"
      size="md"
      class="w-full"
      :disabled="!hasEnoughPoints"
      :loading="isRedeeming"
      @click="handleButtonClick"
    >
      Tukar Poin
    </Button>
  </Footer>

  <!-- Recipient Info Bottom Sheet -->
  <RecipientInfoBottomSheet
    v-model:open="showEditRecipientSheet"
    :email="recipientData.email"
    :phone="recipientData.noHp"
    @save="handleSaveRecipientInfo"
  />

  <!-- Confirmation Bottom Sheet -->
  <ConfirmationBottomSheet
    v-model:open="showConfirmationSheet"
    :image="MascotIllustration"
    title="Menukarkan hadiah?"
    :description="confirmationDescription"
    button-layout="row"
    :buttons="[
      {
        label: 'Kembali',
        variant: 'secondary',
        onClick: handleCancelExchange,
      },
      {
        label: 'Tukar Poin',
        variant: 'primary',
        loading: isRedeeming,
        onClick: handleConfirmExchange,
      },
    ]"
  />

  <!-- Error Bottom Sheet -->
  <ConfirmationBottomSheet
    v-model:open="showErrorSheet"
    :image="errorIllustration"
    :title="errorTitle"
    :description="errorDescription"
    :button-layout="'column'"
    :buttons="errorSheetButtons"
  />
</template>
