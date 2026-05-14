import { InvoiceData, formatCurrency } from "@/lib/invoice-types"

interface TemplateProps {
  data: InvoiceData
}

export function ClassicTemplate({ data }: TemplateProps) {
  const invNumber = `${data.invoicePrefix || "INV"}-${String(data.serialNumber).padStart(4, "0")}`

  return (
    <div className="bg-white text-gray-900 p-8 font-sans text-sm min-h-[842px] w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          {data.companyLogoUrl && (
            <img src={data.companyLogoUrl} alt="Logo" className="h-12 w-auto object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: data.accentColor }}>
              Invoice {invNumber}
            </h1>
          </div>
        </div>
        {data.companySignatureUrl && (
          <img src={data.companySignatureUrl} alt="Signature" className="h-10 w-auto object-contain" />
        )}
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-x-8 mb-6 text-xs text-gray-600">
        <div className="space-y-1">
          <div className="flex gap-8"><span className="font-medium text-gray-900 w-24">Serial Number</span><span>{data.serialNumber.toString().padStart(4, "0")}</span></div>
          <div className="flex gap-8"><span className="font-medium text-gray-900 w-24">Date</span><span>{data.date}</span></div>
          {data.dueDate && <div className="flex gap-8"><span className="font-medium text-gray-900 w-24">Due Date</span><span>{data.dueDate}</span></div>}
          <div className="flex gap-8"><span className="font-medium text-gray-900 w-24">Currency</span><span>{data.currency}</span></div>
        </div>
      </div>

      {/* Billed By / To */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border rounded-lg p-4" style={{ borderColor: `${data.accentColor}30` }}>
          <h3 className="text-xs font-semibold mb-2" style={{ color: data.accentColor }}>Billed By</h3>
          <p className="font-medium">{data.companyName || "—"}</p>
          <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{data.companyAddress || "—"}</p>
          {data.companyFields.map((f, i) => (
            <p key={i} className="text-xs text-gray-500"><span className="font-medium text-gray-700">{f.label}:</span> {f.value}</p>
          ))}
        </div>
        <div className="border rounded-lg p-4" style={{ borderColor: `${data.accentColor}30` }}>
          <h3 className="text-xs font-semibold mb-2" style={{ color: data.accentColor }}>Billed To</h3>
          <p className="font-medium">{data.clientName || "—"}</p>
          <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{data.clientAddress || "—"}</p>
          {data.clientFields.map((f, i) => (
            <p key={i} className="text-xs text-gray-500"><span className="font-medium text-gray-700">{f.label}:</span> {f.value}</p>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-white" style={{ backgroundColor: data.accentColor }}>
          <span className="col-span-5">Item</span>
          <span className="col-span-1 text-center">Qty</span>
          <span className="col-span-2 text-right">Price</span>
          <span className="col-span-2 text-right">Disc.</span>
          <span className="col-span-2 text-right">Total</span>
        </div>
        {data.items.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-400 text-xs border-b">No items added</div>
        ) : (
          data.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 text-xs border-b border-gray-100">
              <div className="col-span-5"><span className="font-medium">{item.title || "—"}</span>{item.description && <p className="text-[10px] text-gray-400 mt-0.5 whitespace-pre-line">{item.description}</p>}</div>
              <span className="col-span-1 text-center">{item.qty}</span>
              <span className="col-span-2 text-right">{formatCurrency(item.price, data.currency)}</span>
              <span className="col-span-2 text-right">{item.discount > 0 ? `-${formatCurrency(item.discount, data.currency)}` : "—"}</span>
              <span className="col-span-2 text-right font-semibold">{formatCurrency(item.qty * item.discountedPrice, data.currency)}</span>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(data.subtotal, data.currency)}</span></div>
          {data.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-{formatCurrency(data.discount, data.currency)}</span></div>}
          {data.taxRate > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax ({data.taxRate}%)</span><span>{formatCurrency(data.taxAmount, data.currency)}</span></div>}
          <div className="flex justify-between pt-2 border-t font-bold text-sm" style={{ borderColor: data.accentColor }}>
            <span>Total</span><span style={{ color: data.accentColor }}>{formatCurrency(data.total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Payment Terms, Notes & Terms */}
      {data.paymentTerms && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Payment Terms</h4>
          <p className="text-xs text-gray-500 whitespace-pre-line">{data.paymentTerms}</p>
        </div>
      )}
      {data.notes && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Notes</h4>
          <p className="text-xs text-gray-500 whitespace-pre-line">{data.notes}</p>
        </div>
      )}
      {data.terms && (
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Terms & Conditions</h4>
          <p className="text-xs text-gray-500 whitespace-pre-line">{data.terms}</p>
        </div>
      )}
    </div>
  )
}
