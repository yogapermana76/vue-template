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
    selectedDistrictId,
    selectedProvinceName,
    selectedCityName,
    selectedDistrictName,
    isLoading,
    isError,
    canSave,
    searchPlaceholder,
    sectionTitle,
    editingLevel,
    handleSelect,
    handleReset,
    handleEditLevel,
    syncFromSelection,
    getSelectedLocation,
  } = useLocationPicker({
    initialSelection: props.selectedLocation,
  })

  // Sync selection when picker opens with existing selection
  watch(
    () => props.open,
    isOpen => {
      if (isOpen && props.selectedLocation) {
        syncFromSelection(props.selectedLocation)
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
    // Reset editing state when closing modal
    editingLevel.value = null
    searchQuery.value = ''
    isOpen.value = false
  }

  const handleResetAndEdit = () => {
    handleReset()
    // After reset, set to editing province so search is enabled
    handleEditLevel('province')
  }

  const handleSave = () => {
    emit('save', getSelectedLocation())
    handleClose()
  }

  // ============================================
  // Computed
  // ============================================

  const emptyStateMessage = computed(() => {
    if (isError.value) return EMPTY_STATE_MESSAGES.error
    if (searchQuery.value) return EMPTY_STATE_MESSAGES.noResults
    return EMPTY_STATE_MESSAGES.noData
  })

  // Hide district list if district is already selected and not being edited
  const shouldShowList = computed(() => {
    // Always show list for province and city
    if (currentLevel.value !== 'district') return true

    // For district: only show if user is actively editing (clicked the field)
    // or if district is not yet selected
    return !selectedDistrictId.value || editingLevel.value === 'district'
  })

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()

  // Disable search when all fields are filled and not editing
  const isSearchDisabled = computed(() => canSave.value && !editingLevel.value)

  const finalSearchPlaceholder = computed(() => {
    return isSearchDisabled.value ? 'Cari Provinsi, Kota, Kecamatan' : searchPlaceholder.value
  })
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
              <SearchInput
                v-model="searchQuery"
                :placeholder="finalSearchPlaceholder"
                :disabled="isSearchDisabled"
              />
            </div>

            <!-- Selected Location Section -->
            <div class="px-4">
              <LocationSelectedFields
                :current-level="currentLevel"
                :province-name="selectedProvinceName"
                :city-name="selectedCityName"
                :district-name="selectedDistrictName"
                @reset="handleResetAndEdit"
                @edit-level="handleEditLevel"
              />
            </div>

            <!-- Divider -->
            <Divider v-if="shouldShowList" class="shrink-0" thick />

            <!-- Location List Section -->
            <div v-if="shouldShowList" class="flex-1 px-4 pt-4 pb-20">
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
