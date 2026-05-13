export async function generatePDF(element: HTMLElement, filename: string) {
  const html2canvas = (await import("html2canvas")).default
  const jsPDF = (await import("jspdf")).default

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgHeight = (canvas.height * pageWidth) / canvas.width

  // If the image is taller than one page, we need multiple pages
  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}
