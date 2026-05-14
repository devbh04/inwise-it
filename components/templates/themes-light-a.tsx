import { InvoiceData, formatCurrency } from "@/lib/invoice-types"
import { ItemsTable, Totals, Footer, BillingBoxes, MetaRow } from "./shared"

// ── 1. MONOCHROME: Pure black/white, hairline rules, no color blocks ──
export function MonochromeTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-white text-black p-10 font-sans text-sm min-h-[842px] w-full">
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
        <div>
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto mb-2 grayscale" />}
          <h1 className="text-3xl font-black tracking-tighter uppercase">INVOICE</h1>
          <p className="text-xs text-gray-500 mt-1">#{String(data.serialNumber).padStart(4, "0")}</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-sm">{data.companyName}</p>
          <p className="text-gray-600">{data.companyAddress}</p>
          <p className="mt-2">Date: {data.date}</p>
          {data.dueDate && <p>Due: {data.dueDate}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
        <div className="border-l-2 border-black pl-4">
          <p className="text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">From</p>
          <p className="font-bold">{data.companyName}</p><p className="text-gray-600">{data.companyAddress}</p>
          {data.companyFields.map((f,i) => <p key={i} className="text-gray-600">{f.label}: {f.value}</p>)}
        </div>
        <div className="border-l-2 border-black pl-4">
          <p className="text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">To</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-gray-600">{data.clientAddress || "—"}</p>
          {data.clientFields.map((f,i) => <p key={i} className="text-gray-600">{f.label}: {f.value}</p>)}
        </div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f5f5f5" borderColor="#e5e5e5" />
      <Totals data={data} accentColor={c} labelClass="text-gray-500" />
      <Footer data={data} labelClass="text-gray-500" />
    </div>
  )
}

// ── 2. BAUHAUS: Geometric blocks, primary colors, asymmetric layout ──
export function BauhausTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#faf8f5] text-[#1a1a1a] font-sans text-sm min-h-[842px] w-full relative overflow-hidden">
      {/* Geometric decorations */}
      <div className="absolute top-0 right-0 w-32 h-32" style={{ backgroundColor: c, opacity: 0.15 }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full" style={{ backgroundColor: c, opacity: 0.1 }} />
      <div className="p-10 relative z-10">
        <div className="flex items-start gap-6 mb-10">
          <div className="w-2 h-20 rounded-full" style={{ backgroundColor: c }} />
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tight" style={{ color: c }}>Invoice</h1>
            <p className="text-lg font-bold mt-1">#{String(data.serialNumber).padStart(4, "0")}</p>
          </div>
          <div className="ml-auto text-right text-xs">
            {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-12 w-auto ml-auto mb-2" />}
            <p className="font-bold text-base">{data.companyName}</p>
            <p className="text-gray-600">{data.companyAddress}</p>
          </div>
        </div>
        <div className="flex gap-4 mb-8">
          <div className="flex-1 p-4 border-l-4" style={{ borderColor: c, backgroundColor: `${c}10` }}>
            <p className="text-[10px] uppercase font-black tracking-widest mb-2" style={{ color: c }}>From</p>
            <p className="font-bold">{data.companyName}</p><p className="text-xs text-gray-600">{data.companyAddress}</p>
          </div>
          <div className="flex-1 p-4 border-l-4" style={{ borderColor: c, backgroundColor: `${c}10` }}>
            <p className="text-[10px] uppercase font-black tracking-widest mb-2" style={{ color: c }}>To</p>
            <p className="font-bold">{data.clientName || "—"}</p><p className="text-xs text-gray-600">{data.clientAddress || "—"}</p>
          </div>
        </div>
        <MetaRow data={data} labelClass="text-gray-500" />
        <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg={`${c}08`} borderColor={`${c}20`} />
        <Totals data={data} accentColor={c} labelClass="text-gray-500" />
        <Footer data={data} labelClass="text-gray-500" />
      </div>
    </div>
  )
}

// ── 3. NEWSPRINT: Newspaper editorial — serif, columns, ruled lines ──
export function NewsprintTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#f4f1ea] text-[#222] p-10 min-h-[842px] w-full" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="text-center border-b-4 border-double border-[#222] pb-4 mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] mb-1">{data.companyName} • Est. {new Date().getFullYear()}</p>
        <h1 className="text-5xl font-bold italic tracking-tight">Invoice</h1>
        <p className="text-xs mt-1 text-gray-500">No. {String(data.serialNumber).padStart(4, "0")} — {data.date}</p>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8 text-xs border-b border-gray-400 pb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: c }}>Issued By</p>
          <p className="font-bold">{data.companyName}</p><p className="text-gray-600 leading-relaxed">{data.companyAddress}</p>
          {data.companyFields.map((f,i) => <p key={i} className="text-gray-600">{f.label}: {f.value}</p>)}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: c }}>Billed To</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-gray-600 leading-relaxed">{data.clientAddress || "—"}</p>
          {data.clientFields.map((f,i) => <p key={i} className="text-gray-600">{f.label}: {f.value}</p>)}
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: c }}>Details</p>
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto ml-auto mb-2" />}
          <p>Date: {data.date}</p>
          {data.dueDate && <p>Due: {data.dueDate}</p>}
          <p>Currency: {data.currency}</p>
        </div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#ece8df" borderColor="#d4cfc5" />
      <Totals data={data} accentColor={c} labelClass="text-gray-500" />
      <Footer data={data} labelClass="text-gray-500" />
    </div>
  )
}

// ── 4. LUXURY: Cream paper, thin serif, gold-style accents, centered header ──
export function LuxuryTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#fdfbf7] text-[#2c2c2c] p-12 min-h-[842px] w-full" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="text-center mb-12">
        {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-14 w-auto mx-auto mb-4" />}
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-px flex-1" style={{ backgroundColor: c }} /><span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: c }}>Invoice</span><div className="h-px flex-1" style={{ backgroundColor: c }} />
        </div>
        <h1 className="text-3xl tracking-wider" style={{ color: c }}>#{String(data.serialNumber).padStart(4, "0")}</h1>
        <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">{data.companyName}</p>
      </div>
      <div className="grid grid-cols-2 gap-12 mb-10 text-xs border-y py-6" style={{ borderColor: `${c}40` }}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: c }}>From</p>
          <p className="font-semibold text-sm">{data.companyName}</p><p className="text-gray-500 mt-1">{data.companyAddress}</p>
          {data.companyFields.map((f,i) => <p key={i} className="text-gray-500">{f.label}: {f.value}</p>)}
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: c }}>To</p>
          <p className="font-semibold text-sm">{data.clientName || "—"}</p><p className="text-gray-500 mt-1">{data.clientAddress || "—"}</p>
          {data.clientFields.map((f,i) => <p key={i} className="text-gray-500">{f.label}: {f.value}</p>)}
        </div>
      </div>
      <MetaRow data={data} labelClass="text-gray-400" />
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f9f7f2" borderColor={`${c}20`} />
      <Totals data={data} accentColor={c} labelClass="text-gray-400" />
      <Footer data={data} labelClass="text-gray-400" />
    </div>
  )
}

// ── 5. SWISS MINIMALIST: Strict grid, Helvetica-bold, asymmetric red accent ──
export function SwissMinimalistTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-white text-black p-12 font-sans text-sm min-h-[842px] w-full">
      <div className="grid grid-cols-12 gap-4 mb-12">
        <div className="col-span-4">
          <div className="w-12 h-1 mb-4" style={{ backgroundColor: c }} />
          <h1 className="text-6xl font-black leading-none">IN<br/>VOICE</h1>
        </div>
        <div className="col-span-4 col-start-9 text-xs space-y-1">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto mb-3" />}
          <p className="font-black text-sm">{data.companyName}</p>
          <p className="text-gray-500">{data.companyAddress}</p>
          <p className="mt-3 font-bold">No. {String(data.serialNumber).padStart(4, "0")}</p>
          <p>Date: {data.date}</p>
          {data.dueDate && <p>Due: {data.dueDate}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-10 text-xs">
        <div><p className="font-black text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: c }}>Sender</p><p className="font-bold">{data.companyName}</p><p>{data.companyAddress}</p></div>
        <div><p className="font-black text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: c }}>Recipient</p><p className="font-bold">{data.clientName || "—"}</p><p>{data.clientAddress || "—"}</p></div>
      </div>
      <ItemsTable data={data} headerBg="#000" headerText="#fff" stripeBg="#fafafa" borderColor="#eee" />
      <Totals data={data} accentColor={c} labelClass="text-gray-500" />
      <Footer data={data} labelClass="text-gray-500" />
    </div>
  )
}

// ── 6. ACADEMIA: University crest style, serif, formal ruled lines ──
export function AcademiaTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#fdfbf7] text-[#2b2b2b] p-10 min-h-[842px] w-full border border-stone-300" style={{ fontFamily: "Georgia, serif" }}>
      <div className="text-center mb-8 pb-6 border-b-2 border-stone-300">
        {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-16 w-auto mx-auto mb-3" />}
        <h1 className="text-2xl font-bold tracking-wide uppercase" style={{ color: c }}>{data.companyName || "Institution"}</h1>
        <p className="text-xs text-stone-400 mt-1 tracking-widest uppercase">Official Invoice • No. {String(data.serialNumber).padStart(4, "0")}</p>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
        <div className="bg-stone-50 rounded p-4 border border-stone-200">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: c }}>From</p>
          <p className="font-bold">{data.companyName}</p><p className="text-stone-500">{data.companyAddress}</p>
          {data.companyFields.map((f,i) => <p key={i} className="text-stone-500">{f.label}: {f.value}</p>)}
        </div>
        <div className="bg-stone-50 rounded p-4 border border-stone-200">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: c }}>To</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-stone-500">{data.clientAddress || "—"}</p>
          {data.clientFields.map((f,i) => <p key={i} className="text-stone-500">{f.label}: {f.value}</p>)}
        </div>
      </div>
      <MetaRow data={data} labelClass="text-stone-400" />
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f5f3ee" borderColor="#ddd5c8" />
      <Totals data={data} accentColor={c} labelClass="text-stone-400" />
      <Footer data={data} labelClass="text-stone-400" />
    </div>
  )
}

// ── 7. SKETCH: Hand-drawn borders, imperfect lines, dashed borders ──
export function SketchTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-white text-slate-800 p-8 min-h-[842px] w-full border-2 border-dashed border-slate-400 rounded-lg font-sans text-sm">
      <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-dotted border-slate-300">
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto" />}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: c, textDecoration: `underline wavy ${c}` }}>Invoice</h1>
            <p className="text-xs text-slate-400">#{String(data.serialNumber).padStart(4, "0")}</p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p className="font-bold text-sm text-slate-700">{data.companyName}</p>
          <p>{data.companyAddress}</p>
        </div>
      </div>
      <MetaRow data={data} labelClass="text-slate-400" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
          <p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>From ✎</p>
          <p className="font-bold text-sm">{data.companyName}</p><p className="text-xs text-slate-500">{data.companyAddress}</p>
        </div>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
          <p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>To ✎</p>
          <p className="font-bold text-sm">{data.clientName || "—"}</p><p className="text-xs text-slate-500">{data.clientAddress || "—"}</p>
        </div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f8f8f8" borderColor="#e2e2e2" />
      <Totals data={data} accentColor={c} labelClass="text-slate-400" />
      <Footer data={data} labelClass="text-slate-400" />
    </div>
  )
}

// ── 8. RETRO: 70s palette, rounded shapes, warm tones ──
export function RetroTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#f5deb3] text-[#4a3728] p-10 min-h-[842px] w-full font-sans text-sm" style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="bg-[#ecdcb8] rounded-2xl p-6 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-12 w-auto rounded-full border-2 border-[#4a3728]" />}
          <div>
            <h1 className="text-3xl font-bold uppercase" style={{ color: c }}>Invoice</h1>
            <p className="text-xs opacity-60">No. {String(data.serialNumber).padStart(4, "0")}</p>
          </div>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-sm">{data.companyName}</p><p className="opacity-60">{data.companyAddress}</p>
          <p className="mt-2">Date: {data.date}</p>{data.dueDate && <p>Due: {data.dueDate}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#ecdcb8] rounded-xl p-4">
          <p className="text-[10px] uppercase font-bold mb-1" style={{ color: c }}>From</p>
          <p className="font-bold">{data.companyName}</p><p className="text-xs opacity-60">{data.companyAddress}</p>
        </div>
        <div className="bg-[#ecdcb8] rounded-xl p-4">
          <p className="text-[10px] uppercase font-bold mb-1" style={{ color: c }}>To</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-xs opacity-60">{data.clientAddress || "—"}</p>
        </div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#ecdcb8" borderColor="#d4c4a0" />
      <Totals data={data} accentColor={c} labelClass="opacity-60" />
      <Footer data={data} labelClass="opacity-60" />
    </div>
  )
}

// ── 9. BOTANICAL: Earthy tones, organic layout, leaf-inspired shapes ──
export function BotanicalTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#f4f6f0] text-[#2c3e2d] p-10 min-h-[842px] w-full font-sans text-sm">
      <div className="flex justify-between items-start mb-10">
        <div>
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-12 w-auto mb-2" />}
          <h1 className="text-3xl font-light tracking-wide" style={{ color: c }}>Invoice</h1>
          <div className="w-16 h-1 mt-2 rounded-full" style={{ backgroundColor: c }} />
          <p className="text-xs text-[#6b7c6d] mt-2">No. {String(data.serialNumber).padStart(4, "0")}</p>
        </div>
        <div className="text-right text-xs text-[#6b7c6d]">
          <p className="font-semibold text-sm text-[#2c3e2d]">{data.companyName}</p>
          <p>{data.companyAddress}</p>
          <p className="mt-2">Date: {data.date}</p>{data.dueDate && <p>Due: {data.dueDate}</p>}
        </div>
      </div>
      <BillingBoxes data={data} accentColor={c} bg="#edf0e8" labelClass="text-[#6b7c6d]" />
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#edf0e8" borderColor="#d5dccf" />
      <Totals data={data} accentColor={c} labelClass="text-[#6b7c6d]" />
      <Footer data={data} labelClass="text-[#6b7c6d]" />
    </div>
  )
}

// ── 10. ORGANIC: Fluid rounded cards, calm tones ──
export function OrganicTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#f9f6f0] text-[#5c4d42] p-10 min-h-[842px] w-full font-sans text-sm">
      <div className="flex justify-between items-center mb-10 bg-[#f0ebe3] rounded-3xl p-6">
        <div className="flex items-center gap-4">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-12 w-12 rounded-2xl object-contain" />}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: c }}>Invoice</h1>
            <p className="text-xs text-[#a89585]">#{String(data.serialNumber).padStart(4, "0")}</p>
          </div>
        </div>
        <div className="text-right text-xs text-[#a89585]">
          <p className="font-bold text-sm text-[#5c4d42]">{data.companyName}</p>
          <p>{data.companyAddress}</p>
        </div>
      </div>
      <MetaRow data={data} labelClass="text-[#a89585]" />
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#f0ebe3] rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: c }}>From</p>
          <p className="font-bold">{data.companyName}</p><p className="text-xs text-[#a89585]">{data.companyAddress}</p>
        </div>
        <div className="bg-[#f0ebe3] rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: c }}>To</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-xs text-[#a89585]">{data.clientAddress || "—"}</p>
        </div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="#f0ebe3" borderColor="#e5ded4" />
      <Totals data={data} accentColor={c} labelClass="text-[#a89585]" />
      <Footer data={data} labelClass="text-[#a89585]" />
    </div>
  )
}
