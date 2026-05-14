import { InvoiceData, formatCurrency } from "@/lib/invoice-types"

// Shared sub-components used by all dynamic templates
export function ItemsTable({ data, headerBg, headerText, stripeBg, borderColor }: {
  data: InvoiceData; headerBg: string; headerText: string; stripeBg: string; borderColor: string
}) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-xs font-bold" style={{ backgroundColor: headerBg, color: headerText }}>
        <span className="col-span-6">Item</span>
        <span className="col-span-2 text-center">Qty</span>
        <span className="col-span-2 text-right">Price</span>
        <span className="col-span-2 text-right">Total</span>
      </div>
      {data.items.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs opacity-40">No items added</div>
      ) : data.items.map((item, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 text-xs" style={{ backgroundColor: i % 2 === 0 ? stripeBg : "transparent", borderBottom: `1px solid ${borderColor}` }}>
          <span className="col-span-6">{item.description || "—"}</span>
          <span className="col-span-2 text-center">{item.qty}</span>
          <span className="col-span-2 text-right">{formatCurrency(item.price, data.currency)}</span>
          <span className="col-span-2 text-right font-semibold">{formatCurrency(item.qty * item.price, data.currency)}</span>
        </div>
      ))}
    </div>
  )
}

export function Totals({ data, accentColor, labelClass }: {
  data: InvoiceData; accentColor: string; labelClass: string
}) {
  return (
    <div className="flex justify-end mb-8">
      <div className="w-64 space-y-1 text-xs">
        <div className="flex justify-between"><span className={labelClass}>Subtotal</span><span>{formatCurrency(data.subtotal, data.currency)}</span></div>
        {data.discount > 0 && <div className="flex justify-between"><span className={labelClass}>Discount</span><span>-{formatCurrency(data.discount, data.currency)}</span></div>}
        {data.taxRate > 0 && <div className="flex justify-between"><span className={labelClass}>Tax ({data.taxRate}%)</span><span>{formatCurrency(data.taxAmount, data.currency)}</span></div>}
        <div className="flex justify-between pt-2 border-t font-bold text-sm" style={{ borderColor: accentColor }}>
          <span>Total</span><span style={{ color: accentColor }}>{formatCurrency(data.total, data.currency)}</span>
        </div>
      </div>
    </div>
  )
}

export function Footer({ data, labelClass }: { data: InvoiceData; labelClass: string }) {
  return (
    <>
      {data.notes && <div className="mb-3"><h4 className="text-xs font-semibold mb-1">Notes</h4><p className={`text-xs ${labelClass}`}>{data.notes}</p></div>}
      {data.terms && <div className="mb-3"><h4 className="text-xs font-semibold mb-1">Terms & Conditions</h4><p className={`text-xs ${labelClass}`}>{data.terms}</p></div>}
      {data.companySignatureUrl && (
        <div className="mt-6 flex flex-col items-end">
          <img src={data.companySignatureUrl} alt="Signature" className="h-10 w-auto object-contain mb-1" />
          <div className={`text-[10px] ${labelClass} border-t border-dashed pt-1 w-40 text-center`}>Authorized Signature</div>
        </div>
      )}
    </>
  )
}

export function BillingBoxes({ data, accentColor, bg, labelClass }: {
  data: InvoiceData; accentColor: string; bg: string; labelClass: string
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="rounded-lg p-4" style={{ backgroundColor: bg }}>
        <h3 className="text-xs font-semibold mb-2" style={{ color: accentColor }}>Billed By</h3>
        <p className="font-medium text-sm">{data.companyName || "—"}</p>
        <p className={`text-xs mt-1 ${labelClass}`}>{data.companyAddress || "—"}</p>
        {data.companyFields.map((f, i) => <p key={i} className={`text-xs ${labelClass}`}><span className="font-medium">{f.label}:</span> {f.value}</p>)}
      </div>
      <div className="rounded-lg p-4" style={{ backgroundColor: bg }}>
        <h3 className="text-xs font-semibold mb-2" style={{ color: accentColor }}>Billed To</h3>
        <p className="font-medium text-sm">{data.clientName || "—"}</p>
        <p className={`text-xs mt-1 ${labelClass}`}>{data.clientAddress || "—"}</p>
        {data.clientFields.map((f, i) => <p key={i} className={`text-xs ${labelClass}`}><span className="font-medium">{f.label}:</span> {f.value}</p>)}
      </div>
    </div>
  )
}

export function MetaRow({ data, labelClass }: { data: InvoiceData; labelClass: string }) {
  return (
    <div className={`flex gap-6 mb-6 text-xs ${labelClass}`}>
      <div><span className="font-medium">Date:</span> {data.date}</div>
      {data.dueDate && <div><span className="font-medium">Due:</span> {data.dueDate}</div>}
      <div><span className="font-medium">Currency:</span> {data.currency}</div>
    </div>
  )
}
