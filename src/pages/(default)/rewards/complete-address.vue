<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import { TextField, TextAreaField } from '@/components/ui/form'
  import { RewardPrizeCard, RecipientInfoItem } from '@/components/rewards'
  import { RecipientInfoBottomSheet } from '@/components/rewards'
  import { LocationField, type SelectedLocation } from '@/components/shared/location-picker'
  import {
    useLastAddress,
    useLotteryRedeem,
    useProvinces,
    useCities,
    useDistricts,
  } from '@/composables/services'

  definePage({
    meta: {
      title: 'Lengkapi Alamat',
    },
  })

  const router = useRouter()

  // Fetch last used address
  const { data: lastAddressData } = useLastAddress()

  // Lottery redeem mutation
  const { mutate: redeemLottery, isPending: isRedeeming } = useLotteryRedeem()

  // Debug: log data on change
  watch(lastAddressData, val => {
    // eslint-disable-next-line no-console
    console.log('Last Address Data:', val)
  })

  // Form state
  const fullAddress = ref('')
  const selectedLocation = ref<SelectedLocation>()
  const postalCode = ref('')

  // Fetch regions data for display names
  const { data: provincesData } = useProvinces()
  const { data: citiesData } = useCities({
    query: { provinceId: computed(() => selectedLocation.value?.provinceId) },
  })
  const { data: districtsData } = useDistricts({
    query: { cityId: computed(() => selectedLocation.value?.cityId) },
  })

  // Create name maps for LocationField display
  const provinceNames = computed(() => {
    const map: Record<number, string> = {}
    provincesData.value?.data?.forEach(p => {
      map[p.id] = p.name
    })
    return map
  })

  const cityNames = computed(() => {
    const map: Record<number, string> = {}
    citiesData.value?.data?.forEach(c => {
      map[c.id] = c.name
    })
    return map
  })

  const districtNames = computed(() => {
    const map: Record<number, string> = {}
    districtsData.value?.data?.forEach(d => {
      map[d.id] = d.name
    })
    return map
  })

  const handleLocationChange = (location: SelectedLocation | undefined) => {
    selectedLocation.value = location
    // eslint-disable-next-line no-console
    console.log('Location changed:', location)
  }

  // Bottom sheet state
  const showEditRecipientSheet = ref(false)

  // Mock data - replace with actual data from route params or store
  const prizeData = {
    image: 'https://placehold.co/80x80', // Replace with actual prize image
    title: 'Tumbler Crokcicle',
    date: 'Kamis, 23 Mei 2026',
  }

  const recipientData = ref({
    name: 'Gita Diaz',
    email: 'gitadiaz@gmail.com',
    phone: '082123456789',
  })

  const handleRecipientClick = () => {
    showEditRecipientSheet.value = true
  }

  const handleSaveRecipientInfo = (email: string, phone: string) => {
    recipientData.value.email = email
    recipientData.value.phone = phone
    showEditRecipientSheet.value = false
  }

  const handleExchangePoints = () => {
    // Navigate to redemption details or success page
    router.push('/rewards/redemption-details')
  }
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

        <RecipientInfoItem
          :name="recipientData.name"
          :email="recipientData.email"
          :phone="recipientData.phone"
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
          <TextAreaField
            v-model="fullAddress"
            label="Alamat Lengkap"
            placeholder="Jl. Kh Ahmad"
            required
            :rows="4"
            resize="none"
          />

          <!-- City/District - Using LocationField -->
          <LocationField
            v-model="selectedLocation"
            label="Kota/kecamatan"
            placeholder="Pilih Kota/Kecamatan"
            picker-title="Kota, Kecamatan"
            :province-names="provinceNames"
            :city-names="cityNames"
            :district-names="districtNames"
            required
            @change="handleLocationChange"
          />

          <!-- Postal Code -->
          <TextField
            v-model="postalCode"
            label="Kode Pos"
            placeholder="10114"
            type="text"
            required
          />
        </div>
      </div>
    </main>
  </div>

  <!-- Footer with Button -->
  <Footer position="fixed">
    <Button variant="primary" size="md" class="w-full" @click="handleExchangePoints">
      Tukar Poin
    </Button>
  </Footer>

  <!-- Recipient Info Bottom Sheet -->
  <RecipientInfoBottomSheet
    v-model:open="showEditRecipientSheet"
    :email="recipientData.email"
    :phone="recipientData.phone"
    @save="handleSaveRecipientInfo"
  />
</template>
