import { InvoiceData, formatCurrency } from "@/lib/invoice-types"
import { ItemsTable, Totals, Footer, BillingBoxes, MetaRow } from "./shared"

// ── 1. SAAS: Rounded cards, gradient header strip, modern SaaS style ──
export function SaasTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-slate-50 text-slate-800 font-sans text-sm min-h-[842px] w-full">
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${c}, ${c}88)` }} />
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto rounded-lg" />}
            <div><h1 className="text-xl font-bold" style={{ color: c }}>Invoice</h1><p className="text-xs text-slate-400">#{String(data.serialNumber).padStart(4, "0")}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-2 text-xs">
            <p className="font-semibold text-slate-700">{data.companyName}</p><p className="text-slate-400">{data.companyAddress}</p>
          </div>
        </div>
        <MetaRow data={data} labelClass="text-slate-400" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: c }}>From</p>
            <p className="font-semibold">{data.companyName}</p><p className="text-xs text-slate-400">{data.companyAddress}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: c }}>To</p>
            <p className="font-semibold">{data.clientName || "—"}</p><p className="text-xs text-slate-400">{data.clientAddress || "—"}</p>
          </div>
        </div>
        <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f8fafc" borderColor="#e2e8f0" />
        <Totals data={data} accentColor={c} labelClass="text-slate-400" />
        <Footer data={data} labelClass="text-slate-400" />
      </div>
    </div>
  )
}

// ── 2. FLAT DESIGN: Zero shadows, solid fills, crisp edges ──
export function FlatDesignTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-white text-gray-900 p-8 font-sans text-sm min-h-[842px] w-full">
      <div className="flex mb-8">
        <div className="flex-1 p-6" style={{ backgroundColor: c }}>
          <h1 className="text-2xl font-bold text-white uppercase">Invoice</h1>
          <p className="text-white/70 text-xs mt-1">#{String(data.serialNumber).padStart(4, "0")}</p>
        </div>
        <div className="flex-1 bg-gray-100 p-6 flex items-center justify-end text-xs text-right">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-8 w-auto mr-3" />}
          <div><p className="font-bold">{data.companyName}</p><p className="text-gray-500">{data.companyAddress}</p></div>
        </div>
      </div>
      <MetaRow data={data} labelClass="text-gray-400" />
      <BillingBoxes data={data} accentColor={c} bg="#f3f4f6" labelClass="text-gray-500" />
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f9fafb" borderColor="#e5e7eb" />
      <Totals data={data} accentColor={c} labelClass="text-gray-400" />
      <Footer data={data} labelClass="text-gray-400" />
    </div>
  )
}

// ── 3. MATERIAL DESIGN: Elevated cards, shadow depth, FAB-style total ──
export function MaterialDesignTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-gray-100 text-gray-900 p-8 font-sans text-sm min-h-[842px] w-full">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-10 rounded-full object-contain" />}
          <div><h1 className="text-xl font-medium" style={{ color: c }}>Invoice</h1><p className="text-xs text-gray-400">#{String(data.serialNumber).padStart(4, "0")}</p></div>
        </div>
        <div className="text-right text-xs text-gray-500"><p className="font-medium text-gray-700">{data.companyName}</p><p>{data.companyAddress}</p></div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <MetaRow data={data} labelClass="text-gray-400" />
        <div className="grid grid-cols-2 gap-6">
          <div><p className="text-[10px] uppercase font-medium tracking-wider mb-2" style={{ color: c }}>Billed By</p><p className="font-medium">{data.companyName}</p><p className="text-xs text-gray-500">{data.companyAddress}</p></div>
          <div><p className="text-[10px] uppercase font-medium tracking-wider mb-2" style={{ color: c }}>Billed To</p><p className="font-medium">{data.clientName || "—"}</p><p className="text-xs text-gray-500">{data.clientAddress || "—"}</p></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#fafafa" borderColor="#eee" />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <Totals data={data} accentColor={c} labelClass="text-gray-400" />
      </div>
      <Footer data={data} labelClass="text-gray-400" />
    </div>
  )
}

// ── 4. NEO BRUTALISM: Thick black borders, offset shadows, loud fills ──
export function NeoBrutalismTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#fffef5] text-black p-8 font-sans text-sm min-h-[842px] w-full border-4 border-black">
      <div className="border-4 border-black p-6 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: c }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto border-2 border-black" />}
            <h1 className="text-3xl font-black uppercase text-white">INVOICE</h1>
          </div>
          <p className="text-lg font-black text-white">#{String(data.serialNumber).padStart(4, "0")}</p>
        </div>
      </div>
      <MetaRow data={data} labelClass="text-gray-600" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
          <p className="text-xs font-black uppercase mb-2" style={{ color: c }}>FROM →</p>
          <p className="font-bold">{data.companyName}</p><p className="text-xs">{data.companyAddress}</p>
        </div>
        <div className="border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
          <p className="text-xs font-black uppercase mb-2" style={{ color: c }}>TO →</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-xs">{data.clientAddress || "—"}</p>
        </div>
      </div>
      <ItemsTable data={data} headerBg="#000" headerText={c} stripeBg="#fffef5" borderColor="#000" />
      <Totals data={data} accentColor={c} labelClass="text-gray-500" />
      <Footer data={data} labelClass="text-gray-500" />
    </div>
  )
}

// ── 5. PLAYFUL GEOMETRIC: Pastel fills, rounded shapes, fun layout ──
export function PlayfulGeometricTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#fff9f0] text-[#333] p-8 font-sans text-sm min-h-[842px] w-full relative overflow-hidden">
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20" style={{ backgroundColor: c }} />
      <div className="absolute bottom-8 left-4 w-14 h-14 rounded-lg rotate-45 opacity-15" style={{ backgroundColor: c }} />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black" style={{ backgroundColor: c }}>
            {data.companyLogoUrl ? <img src={data.companyLogoUrl} alt="" className="h-10 w-10 rounded-xl object-contain" /> : "✦"}
          </div>
          <div><h1 className="text-2xl font-bold" style={{ color: c }}>Invoice ✨</h1><p className="text-xs text-gray-400">#{String(data.serialNumber).padStart(4, "0")}</p></div>
          <div className="ml-auto text-right text-xs text-gray-500"><p className="font-bold text-gray-700">{data.companyName}</p><p>{data.companyAddress}</p></div>
        </div>
        <MetaRow data={data} labelClass="text-gray-400" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-5 border-2 border-dashed" style={{ borderColor: `${c}60` }}>
            <p className="text-[10px] font-bold uppercase mb-2" style={{ color: c }}>From</p>
            <p className="font-bold">{data.companyName}</p><p className="text-xs text-gray-500">{data.companyAddress}</p>
          </div>
          <div className="rounded-2xl p-5 border-2 border-dashed" style={{ borderColor: `${c}60` }}>
            <p className="text-[10px] font-bold uppercase mb-2" style={{ color: c }}>To</p>
            <p className="font-bold">{data.clientName || "—"}</p><p className="text-xs text-gray-500">{data.clientAddress || "—"}</p>
          </div>
        </div>
        <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg={`${c}08`} borderColor={`${c}15`} />
        <Totals data={data} accentColor={c} labelClass="text-gray-400" />
        <Footer data={data} labelClass="text-gray-400" />
      </div>
    </div>
  )
}

// ── 6. CLAYMORPHISM: Soft puffy elements, inner shadows, pastel ──
export function ClaymorphismTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="text-[#4a5568] p-10 min-h-[842px] w-full font-sans text-sm" style={{ backgroundColor: "#e8ecf1" }}>
      <div className="rounded-[20px] p-6 mb-6 flex justify-between items-center" style={{ background: "#e8ecf1", boxShadow: "8px 8px 16px #c8ccd1, -8px -8px 16px #ffffff" }}>
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-10 rounded-xl object-contain" />}
          <div><h1 className="text-xl font-bold" style={{ color: c }}>Invoice</h1><p className="text-xs text-gray-400">#{String(data.serialNumber).padStart(4, "0")}</p></div>
        </div>
        <div className="text-right text-xs"><p className="font-bold">{data.companyName}</p><p className="text-gray-400">{data.companyAddress}</p></div>
      </div>
      <MetaRow data={data} labelClass="text-gray-400" />
      <div className="grid grid-cols-2 gap-6 mb-8">
        {["From", "To"].map((label, idx) => {
          const info = idx === 0 ? { name: data.companyName, addr: data.companyAddress } : { name: data.clientName || "—", addr: data.clientAddress || "—" }
          return (
            <div key={label} className="rounded-2xl p-5" style={{ background: "#e8ecf1", boxShadow: "inset 4px 4px 8px #c8ccd1, inset -4px -4px 8px #ffffff" }}>
              <p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>{label}</p>
              <p className="font-bold">{info.name}</p><p className="text-xs text-gray-400">{info.addr}</p>
            </div>
          )
        })}
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#dde1e6" borderColor="#d0d5db" />
      <Totals data={data} accentColor={c} labelClass="text-gray-400" />
      <Footer data={data} labelClass="text-gray-400" />
    </div>
  )
}

// ── 7. PROFESSIONAL: Top color bar, clean corporate grid ──
export function ProfessionalTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-white text-gray-800 font-sans text-sm min-h-[842px] w-full border-t-[6px]" style={{ borderTopColor: c }}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-12 w-auto" />}
            <div><p className="font-bold text-lg">{data.companyName}</p><p className="text-xs text-gray-400">{data.companyAddress}</p></div>
          </div>
          <div className="text-right"><h1 className="text-2xl font-bold" style={{ color: c }}>INVOICE</h1><p className="text-xs text-gray-400 mt-1">#{String(data.serialNumber).padStart(4, "0")}</p></div>
        </div>
        <MetaRow data={data} labelClass="text-gray-400" />
        <BillingBoxes data={data} accentColor={c} bg="#f9fafb" labelClass="text-gray-500" />
        <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f9fafb" borderColor="#e5e7eb" />
        <Totals data={data} accentColor={c} labelClass="text-gray-400" />
        <Footer data={data} labelClass="text-gray-400" />
      </div>
    </div>
  )
}

// ── 8. ENTERPRISE: Dense data, compact rows, breadcrumb meta ──
export function EnterpriseTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-white text-slate-900 p-6 font-sans text-xs min-h-[842px] w-full">
      <div className="flex justify-between items-center pb-3 mb-4 border-b-2" style={{ borderColor: c }}>
        <div className="flex items-center gap-2">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-6 w-auto" />}
          <span className="font-bold text-sm">{data.companyName}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span>INV-{String(data.serialNumber).padStart(4, "0")}</span>
          <span>•</span><span>{data.date}</span>
          {data.dueDate && <><span>•</span><span>Due: {data.dueDate}</span></>}
          <span>•</span><span>{data.currency}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 text-[10px]">
        <div className="bg-slate-50 p-3 rounded"><p className="font-bold uppercase tracking-wider mb-1" style={{ color: c }}>From</p><p className="font-bold text-xs">{data.companyName}</p><p className="text-slate-500">{data.companyAddress}</p></div>
        <div className="bg-slate-50 p-3 rounded"><p className="font-bold uppercase tracking-wider mb-1" style={{ color: c }}>To</p><p className="font-bold text-xs">{data.clientName || "—"}</p><p className="text-slate-500">{data.clientAddress || "—"}</p></div>
        <div className="bg-slate-50 p-3 rounded"><p className="font-bold uppercase tracking-wider mb-1" style={{ color: c }}>Summary</p><p>Subtotal: {formatCurrency(data.subtotal, data.currency)}</p>{data.taxRate > 0 && <p>Tax: {formatCurrency(data.taxAmount, data.currency)}</p>}<p className="font-bold mt-1" style={{ color: c }}>Total: {formatCurrency(data.total, data.currency)}</p></div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f8fafc" borderColor="#e2e8f0" />
      <Totals data={data} accentColor={c} labelClass="text-slate-400" />
      <Footer data={data} labelClass="text-slate-400" />
    </div>
  )
}

// ── 9. INDUSTRIAL: Utilitarian, stencil-like, warning stripes ──
export function IndustrialTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#e8e8e8] text-[#2f4f4f] p-8 min-h-[842px] w-full font-mono text-sm uppercase">
      <div className="bg-[#2f4f4f] text-[#e8e8e8] p-5 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-8 w-auto invert" />}
          <h1 className="text-2xl font-bold tracking-widest" style={{ color: c }}>INVOICE</h1>
        </div>
        <p className="font-bold">NO. {String(data.serialNumber).padStart(4, "0")}</p>
      </div>
      <div className="h-2 mb-6" style={{ background: `repeating-linear-gradient(45deg, ${c}, ${c} 10px, transparent 10px, transparent 20px)` }} />
      <MetaRow data={data} labelClass="text-gray-500" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-2 border-[#2f4f4f] p-4"><p className="text-[10px] font-bold mb-1" style={{ color: c }}>SENDER</p><p className="font-bold normal-case">{data.companyName}</p><p className="text-xs normal-case text-gray-600">{data.companyAddress}</p></div>
        <div className="border-2 border-[#2f4f4f] p-4"><p className="text-[10px] font-bold mb-1" style={{ color: c }}>RECEIVER</p><p className="font-bold normal-case">{data.clientName || "—"}</p><p className="text-xs normal-case text-gray-600">{data.clientAddress || "—"}</p></div>
      </div>
      <ItemsTable data={data} headerBg="#2f4f4f" headerText={c} stripeBg="#ddd" borderColor="#bbb" />
      <Totals data={data} accentColor={c} labelClass="text-gray-500" />
      <Footer data={data} labelClass="text-gray-500" />
    </div>
  )
}

// ── 10. NEUMORPHISM: Soft extruded UI, subtle inner/outer shadows ──
export function NeumorphismTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  const neu = { background: "#e0e5ec", boxShadow: "6px 6px 12px #b8bec7, -6px -6px 12px #ffffff" }
  const neuInset = { background: "#e0e5ec", boxShadow: "inset 3px 3px 6px #b8bec7, inset -3px -3px 6px #ffffff" }
  return (
    <div className="text-[#4a5568] p-10 min-h-[842px] w-full font-sans text-sm" style={{ backgroundColor: "#e0e5ec" }}>
      <div className="rounded-2xl p-6 mb-8 flex justify-between items-center" style={neu}>
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-10 rounded-xl object-contain" />}
          <div><h1 className="text-xl font-bold" style={{ color: c }}>Invoice</h1><p className="text-xs text-gray-400">#{String(data.serialNumber).padStart(4, "0")}</p></div>
        </div>
        <div className="text-right text-xs"><p className="font-bold">{data.companyName}</p><p className="text-gray-400">{data.companyAddress}</p></div>
      </div>
      <MetaRow data={data} labelClass="text-gray-400" />
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl p-5" style={neuInset}><p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>From</p><p className="font-bold">{data.companyName}</p><p className="text-xs text-gray-400">{data.companyAddress}</p></div>
        <div className="rounded-xl p-5" style={neuInset}><p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>To</p><p className="font-bold">{data.clientName || "—"}</p><p className="text-xs text-gray-400">{data.clientAddress || "—"}</p></div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#d8dde4" borderColor="#cdd2d9" />
      <Totals data={data} accentColor={c} labelClass="text-gray-400" />
      <Footer data={data} labelClass="text-gray-400" />
    </div>
  )
}

// ── 11. MAXIMALISM: Loud borders, big type, gradient fills ──
export function MaximalismTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-yellow-200 text-purple-900 p-8 min-h-[842px] w-full font-sans text-sm border-8" style={{ borderColor: c }}>
      <div className="mb-6 p-6 rounded-xl" style={{ background: `linear-gradient(135deg, ${c}30, ${c}10)` }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-12 w-auto" />}
            <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: c }}>INVOICE!!</h1>
          </div>
          <p className="text-2xl font-black" style={{ color: c }}>#{String(data.serialNumber).padStart(4, "0")}</p>
        </div>
      </div>
      <MetaRow data={data} labelClass="text-purple-600" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-4 rounded-xl p-4" style={{ borderColor: c, backgroundColor: `${c}10` }}>
          <p className="text-xs font-black uppercase mb-1" style={{ color: c }}>FROM</p>
          <p className="font-bold">{data.companyName}</p><p className="text-xs">{data.companyAddress}</p>
        </div>
        <div className="border-4 rounded-xl p-4" style={{ borderColor: c, backgroundColor: `${c}10` }}>
          <p className="text-xs font-black uppercase mb-1" style={{ color: c }}>TO</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-xs">{data.clientAddress || "—"}</p>
        </div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg={`${c}08`} borderColor={`${c}30`} />
      <Totals data={data} accentColor={c} labelClass="text-purple-600" />
      <Footer data={data} labelClass="text-purple-600" />
    </div>
  )
}
