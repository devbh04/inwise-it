import { InvoiceData, InvoiceItem, CustomField } from "@/lib/invoice-types"

export function createDefaultInvoiceData(): InvoiceData {
  return {
    invoicePrefix: "INV",
    serialNumber: 1,
    templateId: "classic",
    accentColor: "#7c3aed",
    isDarkMode: false,
    companyName: "",
    companyAddress: "",
    companyLogoUrl: null,
    companySignatureUrl: null,
    companyFields: [],
    clientName: "",
    clientAddress: "",
    clientFields: [],
    date: new Date().toISOString().split("T")[0],
    dueDate: null,
    currency: "USD",
    notes: null,
    terms: null,
    paymentTerms: null,
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    status: "draft",
  }
}

export function recalculateTotals(data: InvoiceData): InvoiceData {
  // Recalculate each item's discountedPrice first
  const items = data.items.map(item => {
    const discountedPrice = item.price - item.discount
    return { ...item, discountedPrice: Math.max(0, discountedPrice) }
  })
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.discountedPrice, 0)
  const afterDiscount = subtotal - data.discount
  const taxAmount = afterDiscount * (data.taxRate / 100)
  const total = afterDiscount + taxAmount
  return { ...data, items, subtotal, taxAmount, total }
}

export function addItem(data: InvoiceData): InvoiceData {
  return recalculateTotals({
    ...data,
    items: [...data.items, { title: "", description: "", qty: 1, price: 0, discount: 0, discountedPrice: 0 }],
  })
}

export function removeItem(data: InvoiceData, index: number): InvoiceData {
  return recalculateTotals({
    ...data,
    items: data.items.filter((_, i) => i !== index),
  })
}

export function updateItem(data: InvoiceData, index: number, field: keyof InvoiceItem, value: string | number): InvoiceData {
  const items = [...data.items]
  items[index] = { ...items[index], [field]: value }
  return recalculateTotals({ ...data, items })
}

export function addCustomField(fields: CustomField[]): CustomField[] {
  return [...fields, { label: "", value: "" }]
}

export function removeCustomField(fields: CustomField[], index: number): CustomField[] {
  return fields.filter((_, i) => i !== index)
}

export function updateCustomField(fields: CustomField[], index: number, key: keyof CustomField, value: string): CustomField[] {
  const updated = [...fields]
  updated[index] = { ...updated[index], [key]: value }
  return updated
}
