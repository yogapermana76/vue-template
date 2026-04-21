<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import { SearchInput } from '@/components/shared/search-input'
  import LocationListGroup from './LocationListGroup.vue'
  import LocationSelectedFields from './LocationSelectedFields.vue'
  import { useLocationPicker, useResponsiveMaxWidth } from '@/composables/ui'
  import { EMPTY_STATE_MESSAGES } from './constants'
  import type { LocationPickerProps, LocationPickerEmits } from './types'

  const props = withDefaults(defineProps<LocationPickerProps>(), {
    title: 'Pilih Lokasi',
  })

  const emit = defineEmits<LocationPickerEmits>()

  // ============================================
  // Location Picker Logic
  // ============================================

  const {
    searchQuery,
    currentLevel,
    groupedData,
    selectedId,
    selectedProvinceId,
    selectedCityId,
    selectedDistrictId,
    selectedProvinceName,
    selectedCityName,
    selectedDistrictName,
    isLoading,
    isError,
    canSave,
    searchPlaceholder,
    sectionTitle,
    handleSelect,
    handleReset,
    handleEditProvince,
    handleEditCity,
    handleEditDistrict,
    getSelectedLocation,
  } = useLocationPicker({
    initialSelection: props.selectedLocation,
  })

  // Watch for prop changes to sync state when picker opens
  watch(
    () => props.open,
    isOpen => {
      if (isOpen && props.selectedLocation) {
        // Sync selected IDs when picker opens with existing selection
        selectedProvinceId.value = props.selectedLocation.provinceId
        selectedCityId.value = props.selectedLocation.cityId
        selectedDistrictId.value = props.selectedLocation.districtId
      }
    },
  )

  // ============================================
  // Modal State
  // ============================================

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  const handleClose = () => {
    isOpen.value = false
  }

  const handleSave = () => {
    const selection = getSelectedLocation()
    emit('save', selection)
    handleClose()
  }

  // ============================================
  // Empty State Message
  // ============================================

  const emptyStateMessage = computed(() => {
    if (isError.value) return EMPTY_STATE_MESSAGES.error
    if (searchQuery.value) return EMPTY_STATE_MESSAGES.noResults
    return EMPTY_STATE_MESSAGES.noData
  })

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-100 bg-black/80"
        data-slot="location-picker-backdrop"
        @click="handleClose"
      />
    </Transition>

    <!-- Modal Content -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-4"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="isOpen" class="fixed inset-0 z-100 flex flex-col" data-slot="location-picker">
        <!-- Centered container with max-width and white background -->
        <div
          class="relative mx-auto flex h-full w-full flex-col bg-white"
          :style="responsiveMaxWidthStyle"
        >
          <!-- Header -->
          <Header
            :title="title"
            positioning="static"
            back-icon="x"
            hide-theme-toggle
            :on-back="handleClose"
          />

          <!-- Content Area with scroll -->
          <div class="flex min-h-0 flex-1 flex-col overflow-y-auto pb-4">
            <!-- Search Input (Sticky) -->
            <div class="sticky top-0 z-10 bg-white px-4 pt-4 pb-3">
              <SearchInput v-model="searchQuery" :placeholder="searchPlaceholder" />
            </div>

            <!-- Selected Location Section -->
            <div class="px-4">
              <LocationSelectedFields
                :current-level="currentLevel"
                :province-name="selectedProvinceName"
                :city-name="selectedCityName"
                :district-name="selectedDistrictName"
                @reset="handleReset"
                @edit-province="handleEditProvince"
                @edit-city="handleEditCity"
                @edit-district="handleEditDistrict"
              />
            </div>

            <!-- Divider -->
            <Divider class="shrink-0" thick />

            <!-- Location List Section -->
            <div class="flex-1 px-4 pt-4 pb-20">
              <h2 class="body-l-semibold mb-3 text-neutral-950">
                {{ sectionTitle }}
              </h2>

              <!-- Loading State -->
              <div
                v-if="isLoading"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <div
                  class="border-primary-600 size-8 animate-spin rounded-full border-2 border-t-transparent"
                />
                <p class="body-m mt-3 text-neutral-400">Memuat data...</p>
              </div>

              <!-- Grouped List -->
              <LocationListGroup
                v-else-if="groupedData.length > 0"
                :groups="groupedData"
                :selected-id="selectedId"
                @select="handleSelect"
              />

              <!-- Empty State -->
              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <p class="body-m text-neutral-400">
                  {{ emptyStateMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Fixed Button -->
          <Footer position="fixed">
            <Button
              variant="primary"
              size="sm"
              class="w-full"
              :disabled="!canSave"
              @click="handleSave"
            >
              Simpan Lokasi
            </Button>
          </Footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
