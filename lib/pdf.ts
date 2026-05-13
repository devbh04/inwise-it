import { InvoiceData } from "@/lib/invoice-types"

export async function generatePDF(filename: string, data: InvoiceData) {
  // Dynamic imports to keep bundle size small
  const { pdf } = await import("@react-pdf/renderer")
  const { InvoicePdfDocument } = await import("@/components/pdf/invoice-pdf")
  const React = await import("react")

  // Create the PDF blob using @react-pdf/renderer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocument = React.createElement(InvoicePdfDocument, { data }) as any
  const blob = await pdf(pdfDocument).toBlob()

  // Create a download link and trigger download
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  // Cleanup
  URL.revokeObjectURL(url)
}
