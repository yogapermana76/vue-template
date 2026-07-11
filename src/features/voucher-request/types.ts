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
  nik: string
  companyName: string
  ticketCategory: string
}

export interface VoucherProgramInfo {
  name: string
  tagline: string
}

export interface VoucherSecurityAssurance {
  id: string
  label: string
}
