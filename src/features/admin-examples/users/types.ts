export type UserRole = 'admin' | 'manager' | 'staff'
export type UserStatus = 'active' | 'invited' | 'suspended'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  phone?: string
  department?: string
  joinedAt: string
  lastLoginAt?: string
}

export type UserFormValues = Omit<User, 'id' | 'joinedAt' | 'lastLoginAt'>

export type UserStatusFilter = 'all' | UserStatus
