export interface VoucherCategory {
  id: string
  label: string
}

// Ticket-category selection on the program-info step (Invitation, VIP, etc.).
export interface TicketCategoryOption {
  value: string
  label: string
}

export interface VoucherRequestFormValues {
  fullName: string
  phone: string
  email: string
  companyName: string
  ticketCategory: string
}

export interface VoucherProgramInfo {
  name: string
  tagline: string
  apiProgramId: number
  apiCategoryId: number
  apiSlug: string
}

export interface VoucherSecurityAssurance {
  id: string
  label: string
}
