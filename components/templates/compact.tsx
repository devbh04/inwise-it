import { InvoiceData, formatCurrency } from "@/lib/invoice-types"

interface TemplateProps { data: InvoiceData }

export function CompactTemplate({ data }: TemplateProps) {
  const inv = `INV-${String(data.serialNumber).padStart(4, "0")}`
  return (
    <div className="bg-white text-gray-900 p-6 font-sans text-xs min-h-[842px] w-full">
      <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b-2" style={{ borderColor: data.accentColor }}>
        <div className="flex items-center gap-2">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-8 w-auto object-contain" />}
          <div>
            <p className="font-bold text-sm">{data.companyName || "Company"}</p>
            <p className="text-[10px] text-gray-500">{data.companyAddress}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold" style={{ color: data.accentColor }}>{inv}</p>
          <p className="text-[10px] text-gray-500">Date: {data.date}</p>
          {data.dueDate && <p className="text-[10px] text-gray-500">Due: {data.dueDate}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 rounded bg-gray-50 border border-gray-200">
        <div><p className="text-[10px] uppercase font-semibold mb-1" style={{ color: data.accentColor }}>From</p><p className="font-medium">{data.companyName}</p><p className="text-gray-500">{data.companyAddress}</p></div>
        <div><p className="text-[10px] uppercase font-semibold mb-1" style={{ color: data.accentColor }}>To</p><p className="font-medium">{data.clientName || "—"}</p><p className="text-gray-500">{data.clientAddress || "—"}</p></div>
      </div>
      <table className="w-full mb-4">
        <thead><tr style={{ backgroundColor: data.accentColor }}><th className="text-left text-white py-1.5 px-2 text-[10px]">Description</th><th className="text-center text-white py-1.5 px-2 text-[10px]">Qty</th><th className="text-right text-white py-1.5 px-2 text-[10px]">Price</th><th className="text-right text-white py-1.5 px-2 text-[10px]">Total</th></tr></thead>
        <tbody>
          {data.items.length === 0 ? <tr><td colSpan={4} className="text-center py-4 text-gray-400">No items</td></tr> : data.items.map((item, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}><td className="py-1.5 px-2 border-b border-gray-100">{item.description || "—"}</td><td className="py-1.5 px-2 border-b border-gray-100 text-center">{item.qty}</td><td className="py-1.5 px-2 border-b border-gray-100 text-right">{formatCurrency(item.price, data.currency)}</td><td className="py-1.5 px-2 border-b border-gray-100 text-right font-medium">{formatCurrency(item.qty * item.price, data.currency)}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mb-4">
        <div className="w-52 space-y-0.5">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(data.subtotal, data.currency)}</span></div>
          {data.discount > 0 && <div className="flex justify-between text-gray-500"><span>Discount</span><span>-{formatCurrency(data.discount, data.currency)}</span></div>}
          {data.taxRate > 0 && <div className="flex justify-between text-gray-500"><span>Tax ({data.taxRate}%)</span><span>{formatCurrency(data.taxAmount, data.currency)}</span></div>}
          <div className="flex justify-between pt-1 mt-1 border-t-2 font-bold text-sm" style={{ borderColor: data.accentColor, color: data.accentColor }}><span>TOTAL</span><span>{formatCurrency(data.total, data.currency)}</span></div>
        </div>
      </div>
      {data.notes && <p className="text-[10px] text-gray-400 mb-2"><span className="font-medium text-gray-600">Notes:</span> {data.notes}</p>}
      {data.terms && <p className="text-[10px] text-gray-400"><span className="font-medium text-gray-600">Terms:</span> {data.terms}</p>}
      {data.companySignatureUrl && <div className="mt-6 flex justify-end"><img src={data.companySignatureUrl} alt="" className="h-8 w-auto" /></div>}
    </div>
  )
}
