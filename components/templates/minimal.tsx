import { InvoiceData, formatCurrency } from "@/lib/invoice-types"

interface TemplateProps {
  data: InvoiceData
}

export function MinimalTemplate({ data }: TemplateProps) {
  const invNumber = `${data.invoicePrefix || "INV"}-${String(data.serialNumber).padStart(4, "0")}`

  return (
    <div className="bg-white text-gray-800 p-10 font-sans text-sm min-h-[842px] w-full">
      {/* Header — ultra clean */}
      <div className="flex justify-between items-start mb-16">
        <div>
          {data.companyLogoUrl ? (
            <img src={data.companyLogoUrl} alt="Logo" className="h-8 w-auto object-contain mb-2" />
          ) : (
            <p className="text-lg font-medium text-gray-900">{data.companyName}</p>
          )}
          <p className="text-xs text-gray-400">{data.companyAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-light tracking-tight" style={{ color: data.accentColor }}>Invoice</p>
          <p className="text-xs text-gray-400 mt-1">{invNumber}</p>
        </div>
      </div>

      {/* Two columns — sparse */}
      <div className="grid grid-cols-2 gap-16 mb-12 text-xs">
        <div>
          <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-2">Bill To</p>
          <p className="font-medium text-gray-900">{data.clientName || "—"}</p>
          <p className="text-gray-500 mt-0.5">{data.clientAddress || "—"}</p>
          {data.clientFields.map((f, i) => (
            <p key={i} className="text-gray-500">{f.label}: {f.value}</p>
          ))}
        </div>
        <div className="text-right">
          <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-2">Details</p>
          <p className="text-gray-600">Date: {data.date}</p>
          {data.dueDate && <p className="text-gray-600">Due: {data.dueDate}</p>}
          <p className="text-gray-600">Currency: {data.currency}</p>
        </div>
      </div>

      {/* Items — no borders, clean lines */}
      <div className="mb-12">
        <div className="grid grid-cols-12 gap-2 pb-2 text-[10px] uppercase tracking-widest text-gray-400 border-b" style={{ borderColor: `${data.accentColor}30` }}>
          <span className="col-span-6">Description</span>
          <span className="col-span-2 text-center">Qty</span>
          <span className="col-span-2 text-right">Rate</span>
          <span className="col-span-2 text-right">Amount</span>
        </div>
        {data.items.length === 0 ? (
          <div className="py-8 text-center text-gray-300 text-xs">No items</div>
        ) : (
          data.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 py-3 text-xs border-b border-gray-50">
              <div className="col-span-6 text-gray-700"><span className="font-medium">{item.title || "—"}</span>{item.description && <p className="text-[10px] text-gray-400 whitespace-pre-line">{item.description}</p>}</div>
              <span className="col-span-2 text-center text-gray-500">{item.qty}</span>
              <span className="col-span-2 text-right text-gray-500">{formatCurrency(item.price, data.currency)}</span>
              <span className="col-span-2 text-right text-gray-700">{formatCurrency(item.qty * item.discountedPrice, data.currency)}</span>
            </div>
          ))
        )}
      </div>

      {/* Totals — right aligned, minimal */}
      <div className="flex justify-end mb-12">
        <div className="w-48 space-y-1 text-xs">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(data.subtotal, data.currency)}</span></div>
          {data.discount > 0 && <div className="flex justify-between text-gray-500"><span>Discount</span><span>-{formatCurrency(data.discount, data.currency)}</span></div>}
          {data.taxRate > 0 && <div className="flex justify-between text-gray-500"><span>Tax ({data.taxRate}%)</span><span>{formatCurrency(data.taxAmount, data.currency)}</span></div>}
          <div className="h-px my-2" style={{ backgroundColor: data.accentColor }} />
          <div className="flex justify-between font-medium text-sm text-gray-900">
            <span>Total</span><span>{formatCurrency(data.total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer notes */}
      <div className="mt-auto space-y-3 text-[11px] text-gray-400">
        {data.paymentTerms && <p className="whitespace-pre-line">{data.paymentTerms}</p>}
        {data.notes && <p className="whitespace-pre-line">{data.notes}</p>}
        {data.terms && <p className="whitespace-pre-line">{data.terms}</p>}
      </div>

      {data.companySignatureUrl && (
        <div className="mt-8">
          <img src={data.companySignatureUrl} alt="Signature" className="h-8 w-auto object-contain opacity-70" />
        </div>
      )}
    </div>
  )
}
