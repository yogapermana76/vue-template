export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  THEME_PREFERENCE: 'theme-preference',
  THEME_FOLLOW_SYSTEM: 'theme-follow-system',
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

interface StorageSchema {
  [STORAGE_KEYS.AUTH_TOKEN]: string
  [STORAGE_KEYS.THEME_PREFERENCE]: string
  [STORAGE_KEYS.THEME_FOLLOW_SYSTEM]: boolean
}

const STRING_KEYS: StorageKey[] = [STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.THEME_PREFERENCE]

export const storage = {
  get<K extends StorageKey>(key: K): StorageSchema[K] | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      if (STRING_KEYS.includes(key)) {
        return item as StorageSchema[K]
      }

      return JSON.parse(item)
    } catch {
      return null
    }
  },

  set<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
    try {
      if (STRING_KEYS.includes(key)) {
        localStorage.setItem(key, value as string)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch {
      // Storage full or disabled
    }
  },

  remove(key: StorageKey): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },
}
