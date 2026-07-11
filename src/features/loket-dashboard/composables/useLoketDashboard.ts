import { computed, ref, watch } from 'vue'
import {
  useLoketPrograms,
  useLoketBanners,
  useLoketCategories,
  useLoketSchedules,
  useLoketStatistics,
} from '@/composables/services/loket'
import type { LoketProgram } from '@/types/services/loket'
import {
  LOKET_DASHBOARD_PAGE_SIZE,
  LOKET_PROGRAMS_PAGE_SIZE,
  LOKET_STATISTICS_POLL_MS,
} from '../constants'
import type { LoketDateRange } from '../types'

export function useLoketDashboard() {
  const selectedProgramId = ref<number | undefined>()
  const selectedCategoryId = ref<number | undefined>()
  const dateRange = ref<LoketDateRange>({ start: null, end: null })

  // Shared page size dedupes this query against monitoring page + scan dialog.
  const programsQuery = useLoketPrograms({
    query: {
      page: 1,
      size: LOKET_PROGRAMS_PAGE_SIZE,
    },
  })

  const programs = computed<LoketProgram[]>(() => programsQuery.data.value?.data ?? [])

  const autoSelectFirstProgram = () => {
    if (selectedProgramId.value === undefined && programs.value.length > 0) {
      selectedProgramId.value = programs.value[0].ID
    }
  }

  // `immediate` covers mocks returning before the watcher subscribes.
  watch(programs, autoSelectFirstProgram, { immediate: true })

  const bannersQuery = useLoketBanners({
    params: { programId: selectedProgramId },
  })

  const categoriesQuery = useLoketCategories({
    params: { programId: selectedProgramId },
  })

  const schedulesQuery = useLoketSchedules({
    query: { page: 1, size: LOKET_DASHBOARD_PAGE_SIZE },
    params: { programId: selectedProgramId },
  })

  const statisticsQuery = useLoketStatistics({
    query: {
      // undefined (not '') so stripEmpty drops the key; backend treats blank ≠ omitted.
      StartDate: computed(() => dateRange.value.start ?? undefined),
      EndDate: computed(() => dateRange.value.end ?? undefined),
      CategoryId: selectedCategoryId,
    },
    params: { programId: selectedProgramId },
    options: {
      // Semi-realtime KPIs; staleTime 0 so scheduled refetch hits the network.
      refetchInterval: LOKET_STATISTICS_POLL_MS,
      staleTime: 0,
    },
  })

  const banners = computed(() => bannersQuery.data.value?.data ?? [])
  const categories = computed(() => categoriesQuery.data.value?.data ?? [])
  const schedules = computed(() => schedulesQuery.data.value?.data ?? [])
  const statistics = computed(() => statisticsQuery.data.value?.data)

  const selectedProgram = computed(() => programs.value.find(p => p.ID === selectedProgramId.value))

  const selectProgram = (programId: number | undefined) => {
    selectedProgramId.value = programId
    // Categories only make sense per program.
    selectedCategoryId.value = undefined
  }

  const setDateRange = (range: LoketDateRange) => {
    dateRange.value = range
  }

  const resetFilters = () => {
    selectedCategoryId.value = undefined
    dateRange.value = { start: null, end: null }
  }

  const refetchAll = () => {
    void programsQuery.refetch()
    void bannersQuery.refetch()
    void categoriesQuery.refetch()
    void schedulesQuery.refetch()
    void statisticsQuery.refetch()
  }

  return {
    selectedProgramId,
    selectedProgram,
    selectedCategoryId,
    dateRange,
    programs,
    banners,
    categories,
    schedules,
    statistics,
    isProgramsLoading: computed(() => programsQuery.isLoading.value),
    isBannersLoading: computed(() => bannersQuery.isLoading.value),
    isCategoriesLoading: computed(() => categoriesQuery.isLoading.value),
    isSchedulesLoading: computed(() => schedulesQuery.isLoading.value),
    isStatisticsLoading: computed(() => statisticsQuery.isLoading.value),
    programsError: computed(() => programsQuery.error.value),
    rootErrorMessage: computed<string | null>(() => {
      const err = programsQuery.error.value
      if (!err) return null
      const anyErr = err as { message?: string }
      return anyErr.message ?? 'Gagal memuat data program.'
    }),
    bannersError: computed(() => bannersQuery.error.value),
    categoriesError: computed(() => categoriesQuery.error.value),
    schedulesError: computed(() => schedulesQuery.error.value),
    statisticsError: computed(() => statisticsQuery.error.value),
    selectProgram,
    setDateRange,
    resetFilters,
    autoSelectFirstProgram,
    refetchAll,
  }
}
