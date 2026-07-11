import type { Component } from 'vue'
import type {
  LoketProgram,
  LoketStatistics,
  LoketCategory,
  LoketSchedule,
  LoketBannerURL,
} from '@/types/services/loket'

export interface LoketStatCard {
  key: keyof LoketStatistics
  title: string
  icon: Component
  format: 'number' | 'currency'
  tone: 'primary' | 'success' | 'warning' | 'info' | 'error' | 'neutral'
}

export interface LoketProgramOption {
  value: string
  label: string
  program: LoketProgram
}

export interface LoketCategoryOption {
  value: string
  label: string
  category: LoketCategory
}

export interface LoketDateRange {
  start: string | null
  end: string | null
}

export type LoketBanner = LoketBannerURL
export type LoketScheduleItem = LoketSchedule
