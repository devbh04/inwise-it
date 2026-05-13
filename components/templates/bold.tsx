import { InvoiceData, formatCurrency } from "@/lib/invoice-types"

interface TemplateProps { data: InvoiceData }

export function BoldTemplate({ data }: TemplateProps) {
  const inv = `INV-${String(data.serialNumber).padStart(4, "0")}`
  return (
    <div className="bg-white text-gray-900 p-8 font-sans text-sm min-h-[842px] w-[595px]">
      {/* Large accent title */}
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: data.accentColor }}>Invoice</h1>
        <p className="text-lg font-bold text-gray-400 mt-1">{inv}</p>
      </div>
      {/* Logo + Meta */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-14 w-auto object-contain rounded-xl" />}
          <div><p className="font-bold text-lg">{data.companyName}</p><p className="text-xs text-gray-500">{data.companyAddress}</p></div>
        </div>
        <div className="text-right text-xs text-gray-500 space-y-0.5">
          <p>Date: {data.date}</p>
          {data.dueDate && <p>Due: {data.dueDate}</p>}
          <p>Currency: {data.currency}</p>
        </div>
      </div>
      {/* Billing sections with rounded corners */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl p-5" style={{ backgroundColor: `${data.accentColor}10`, border: `2px solid ${data.accentColor}25` }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: data.accentColor }}>From</h3>
          <p className="font-semibold">{data.companyName || "—"}</p>
          <p className="text-xs text-gray-500 mt-1">{data.companyAddress}</p>
          {data.companyFields.map((f, i) => <p key={i} className="text-xs text-gray-500">{f.label}: {f.value}</p>)}
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: `${data.accentColor}10`, border: `2px solid ${data.accentColor}25` }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: data.accentColor }}>To</h3>
          <p className="font-semibold">{data.clientName || "—"}</p>
          <p className="text-xs text-gray-500 mt-1">{data.clientAddress}</p>
          {data.clientFields.map((f, i) => <p key={i} className="text-xs text-gray-500">{f.label}: {f.value}</p>)}
        </div>
      </div>
      {/* Items table — thick header */}
      <div className="mb-8 rounded-xl overflow-hidden" style={{ border: `2px solid ${data.accentColor}25` }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold text-white uppercase tracking-wider" style={{ backgroundColor: data.accentColor }}>
          <span className="col-span-6">Item</span><span className="col-span-2 text-center">Qty</span><span className="col-span-2 text-right">Price</span><span className="col-span-2 text-right">Total</span>
        </div>
        {data.items.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-xs">No items added</div>
        ) : data.items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 text-xs border-b" style={{ borderColor: `${data.accentColor}15` }}>
            <span className="col-span-6 font-medium">{item.description || "—"}</span><span className="col-span-2 text-center text-gray-500">{item.qty}</span><span className="col-span-2 text-right text-gray-500">{formatCurrency(item.price, data.currency)}</span><span className="col-span-2 text-right font-semibold">{formatCurrency(item.qty * item.price, data.currency)}</span>
          </div>
        ))}
      </div>
      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1 text-xs">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(data.subtotal, data.currency)}</span></div>
          {data.discount > 0 && <div className="flex justify-between text-gray-500"><span>Discount</span><span>-{formatCurrency(data.discount, data.currency)}</span></div>}
          {data.taxRate > 0 && <div className="flex justify-between text-gray-500"><span>Tax ({data.taxRate}%)</span><span>{formatCurrency(data.taxAmount, data.currency)}</span></div>}
          <div className="flex justify-between pt-2 mt-2 font-black text-lg rounded-xl px-4 py-2 text-white" style={{ backgroundColor: data.accentColor }}>
            <span>TOTAL</span><span>{formatCurrency(data.total, data.currency)}</span>
          </div>
        </div>
      </div>
      {data.notes && <p className="text-xs text-gray-500 mb-2"><span className="font-bold text-gray-700">Notes:</span> {data.notes}</p>}
      {data.terms && <p className="text-xs text-gray-500"><span className="font-bold text-gray-700">Terms:</span> {data.terms}</p>}
      {data.companySignatureUrl && <div className="mt-8"><img src={data.companySignatureUrl} alt="" className="h-10 w-auto" /><p className="text-[10px] text-gray-400 mt-1">Authorized Signature</p></div>}
    </div>
  )
}
