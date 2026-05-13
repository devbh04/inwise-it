export async function generatePDF(element: HTMLElement, filename: string) {
  const originalTitle = document.title
  document.title = filename.replace(/\.pdf$/, '')

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const iframeWindow = iframe.contentWindow
  const iframeDoc = iframeWindow?.document
  if (!iframeWindow || !iframeDoc) return

  // Clone the target element
  const clone = element.cloneNode(true) as HTMLElement

  // Force the clone to fill the full page width
  clone.style.width = '100%'
  clone.style.maxWidth = '100%'
  clone.style.boxShadow = 'none'
  clone.style.borderRadius = '0'
  clone.style.margin = '0'
  clone.style.overflow = 'visible'

  // Copy all stylesheets from the parent document
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(style => style.cloneNode(true))

  iframeDoc.open()
  iframeDoc.write('<html><head></head><body></body></html>')
  iframeDoc.close()

  styles.forEach(style => iframeDoc.head.appendChild(style))

  const printStyle = iframeDoc.createElement('style')
  printStyle.textContent = `
    @page { 
      margin: 0; 
      size: A4;
    }
    html, body { 
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background: white !important;
      -webkit-print-color-adjust: exact !important; 
      print-color-adjust: exact !important; 
    }
    body > * {
      width: 100% !important;
      max-width: 100% !important;
    }
    * {
      -webkit-print-color-adjust: exact !important; 
      print-color-adjust: exact !important;
    }
  `
  iframeDoc.head.appendChild(printStyle)
  iframeDoc.body.appendChild(clone)

  // Wait for styles + images to load
  await new Promise(resolve => setTimeout(resolve, 600))

  iframeWindow.focus()
  iframeWindow.print()

  // Cleanup after dialog closes
  setTimeout(() => {
    document.body.removeChild(iframe)
    document.title = originalTitle
  }, 1000)
}
