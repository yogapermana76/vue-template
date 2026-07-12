import type { Component } from 'vue'
import type { Program, Statistics, Category, Schedule, BannerURL } from '@/types/services'

export interface StatCard {
  key: keyof Statistics
  title: string
  icon: Component
  format: 'number' | 'currency'
  tone: 'primary' | 'success' | 'warning' | 'info' | 'error' | 'neutral'
}

export interface ProgramOption {
  value: string
  label: string
  program: Program
}

export interface CategoryOption {
  value: string
  label: string
  category: Category
}

export interface DateRange {
  start: string | null
  end: string | null
}

export type Banner = BannerURL
export type ScheduleItem = Schedule
