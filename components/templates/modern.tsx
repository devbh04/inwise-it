import { InvoiceData, formatCurrency } from "@/lib/invoice-types"

interface TemplateProps {
  data: InvoiceData
}

export function ModernTemplate({ data }: TemplateProps) {
  const invNumber = `INV-${String(data.serialNumber).padStart(4, "0")}`

  return (
    <div className="bg-white text-gray-900 font-sans text-sm min-h-[842px] w-full">
      {/* Full-width accent header */}
      <div className="px-8 py-6" style={{ backgroundColor: data.accentColor }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {data.companyLogoUrl && (
              <img src={data.companyLogoUrl} alt="Logo" className="h-10 w-auto object-contain rounded" />
            )}
            <div className="text-white">
              <h1 className="text-xl font-bold">INVOICE</h1>
              <p className="text-white/70 text-xs">{invNumber}</p>
            </div>
          </div>
          <div className="text-white text-right text-xs">
            <p className="font-medium">{data.companyName}</p>
            <p className="text-white/60">{data.companyAddress}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Meta bar */}
        <div className="flex gap-6 mb-6 text-xs text-gray-500 pb-4 border-b border-gray-100">
          <div><span className="font-medium text-gray-700">Date:</span> {data.date}</div>
          {data.dueDate && <div><span className="font-medium text-gray-700">Due:</span> {data.dueDate}</div>}
          <div><span className="font-medium text-gray-700">Currency:</span> {data.currency}</div>
          <div><span className="font-medium text-gray-700">Status:</span> <span className="capitalize">{data.status}</span></div>
        </div>

        {/* Billed To */}
        <div className="mb-6 p-4 rounded-xl bg-gray-50">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: data.accentColor }}>Bill To</h3>
          <p className="font-medium text-sm">{data.clientName || "—"}</p>
          <p className="text-xs text-gray-500">{data.clientAddress || "—"}</p>
          {data.clientFields.map((f, i) => (
            <p key={i} className="text-xs text-gray-500">{f.label}: {f.value}</p>
          ))}
        </div>

        {/* Items as cards */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: data.accentColor }}>Items</h3>
          {data.items.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs rounded-xl bg-gray-50">No items added</div>
          ) : (
            data.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.description || "—"}</p>
                  <p className="text-xs text-gray-400">{item.qty} × {formatCurrency(item.price, data.currency)}</p>
                </div>
                <p className="font-semibold text-sm">{formatCurrency(item.qty * item.price, data.currency)}</p>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-1 text-xs">
            <div className="flex justify-between py-1"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(data.subtotal, data.currency)}</span></div>
            {data.discount > 0 && <div className="flex justify-between py-1"><span className="text-gray-500">Discount</span><span>-{formatCurrency(data.discount, data.currency)}</span></div>}
            {data.taxRate > 0 && <div className="flex justify-between py-1"><span className="text-gray-500">Tax ({data.taxRate}%)</span><span>{formatCurrency(data.taxAmount, data.currency)}</span></div>}
            <div className="flex justify-between py-2 mt-1 rounded-lg px-3 text-white font-bold text-sm" style={{ backgroundColor: data.accentColor }}>
              <span>Total</span><span>{formatCurrency(data.total, data.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {(data.notes || data.terms) && (
          <div className="border-t border-gray-100 pt-4 space-y-3 text-xs text-gray-500">
            {data.notes && <div><span className="font-medium text-gray-700">Notes:</span> {data.notes}</div>}
            {data.terms && <div><span className="font-medium text-gray-700">Terms:</span> {data.terms}</div>}
          </div>
        )}

        {/* Signature */}
        {data.companySignatureUrl && (
          <div className="mt-8 pt-4 border-t border-gray-100">
            <img src={data.companySignatureUrl} alt="Signature" className="h-10 w-auto object-contain" />
            <p className="text-xs text-gray-400 mt-1">Authorized Signature</p>
          </div>
        )}
      </div>
    </div>
  )
}
