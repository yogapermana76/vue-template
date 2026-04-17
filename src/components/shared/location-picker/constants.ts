/**
 * Location Picker Constants
 * Centralized string literals and configuration
 */

import type { LocationLevel } from './types'

/** Search placeholder texts by level */
export const SEARCH_PLACEHOLDERS: Record<LocationLevel, string> = {
  province: 'Cari Provinsi',
  city: 'Cari Kota',
  district: 'Cari Kecamatan',
}

/** Section title texts by level */
export const SECTION_TITLES: Record<LocationLevel, string> = {
  province: 'Daftar Provinsi',
  city: 'Daftar Kota',
  district: 'Daftar Kecamatan',
}

/** Field label texts by level */
export const FIELD_LABELS: Record<LocationLevel, string> = {
  province: 'Pilih Provinsi',
  city: 'Pilih Kota',
  district: 'Pilih Kecamatan',
}

/** Empty state messages */
export const EMPTY_STATE_MESSAGES = {
  error: 'Gagal memuat data',
  noResults: 'Tidak ada hasil ditemukan',
  noData: 'Belum ada data tersedia',
} as const
