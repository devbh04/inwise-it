export interface InvoiceItem {
  description: string
  qty: number
  price: number
}

export interface CustomField {
  label: string
  value: string
}

export interface InvoiceData {
  serialNumber: number
  templateId: string
  accentColor: string

  companyName: string
  companyAddress: string
  companyLogoUrl?: string | null
  companySignatureUrl?: string | null
  companyFields: CustomField[]

  clientName: string
  clientAddress: string
  clientFields: CustomField[]

  date: string
  dueDate?: string | null
  currency: string
  notes?: string | null
  terms?: string | null

  items: InvoiceItem[]

  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number

  status: string
}

export const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "CAD", label: "CAD (C$)", symbol: "C$" },
  { value: "AUD", label: "AUD (A$)", symbol: "A$" },
]

export function getCurrencySymbol(currency: string): string {
  return CURRENCIES.find((c) => c.value === currency)?.symbol || "$"
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toFixed(2)}`
}

export const TEMPLATE_IDS = ["classic", "modern", "minimal", "compact", "bold"] as const
export type TemplateId = (typeof TEMPLATE_IDS)[number]

export interface TemplateInfo {
  id: TemplateId
  name: string
  description: string
}

export const TEMPLATES: TemplateInfo[] = [
  { id: "classic", name: "Classic", description: "Traditional professional layout" },
  { id: "modern", name: "Modern", description: "Full-width accent header" },
  { id: "minimal", name: "Minimal", description: "Clean with lots of whitespace" },
  { id: "compact", name: "Compact", description: "Dense layout for many items" },
  { id: "bold", name: "Bold", description: "Large accent title, thick headers" },
]
