import { InvoiceData, formatCurrency } from "@/lib/invoice-types"
import { ItemsTable, Totals, Footer, MetaRow } from "./shared"

// ── 1. MODERN DARK: Sleek dark with gradient accent bar ──
export function ModernDarkTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#0f1117] text-gray-200 font-sans text-sm min-h-[842px] w-full">
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c}, ${c}66)` }} />
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto rounded-lg" />}
            <div><h1 className="text-xl font-bold" style={{ color: c }}>Invoice</h1><p className="text-xs text-gray-500">#{String(data.serialNumber).padStart(4, "0")}</p></div>
          </div>
          <div className="text-right text-xs text-gray-400"><p className="font-semibold text-gray-200">{data.companyName}</p><p>{data.companyAddress}</p></div>
        </div>
        <MetaRow data={data} labelClass="text-gray-500" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10"><p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: c }}>From</p><p className="font-semibold text-white">{data.companyName}</p><p className="text-xs text-gray-400">{data.companyAddress}</p></div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10"><p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: c }}>To</p><p className="font-semibold text-white">{data.clientName || "—"}</p><p className="text-xs text-gray-400">{data.clientAddress || "—"}</p></div>
        </div>
        <ItemsTable data={data} headerBg={c} headerText="#fff" stripeBg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.08)" />
        <Totals data={data} accentColor={c} labelClass="text-gray-500" />
        <Footer data={data} labelClass="text-gray-500" />
      </div>
    </div>
  )
}

// ── 2. TERMINAL: Green-on-black, monospace, command-line aesthetic ──
export function TerminalTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-black text-sm min-h-[842px] w-full p-8" style={{ color: c, fontFamily: "'Courier New', monospace" }}>
      <div className="border rounded-lg p-4 mb-6" style={{ borderColor: `${c}40` }}>
        <p className="text-xs opacity-50 mb-2">$ cat invoice.txt</p>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">INVOICE #{String(data.serialNumber).padStart(4, "0")}</h1>
            <p className="text-xs opacity-60 mt-1">{data.companyName}</p>
          </div>
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-8 w-auto opacity-70" />}
        </div>
      </div>
      <p className="text-xs opacity-50 mb-1">$ echo $METADATA</p>
      <div className="flex gap-6 text-xs mb-6 opacity-80">
        <span>DATE={data.date}</span>{data.dueDate && <span>DUE={data.dueDate}</span>}<span>CURRENCY={data.currency}</span>
      </div>
      <p className="text-xs opacity-50 mb-1">$ cat parties.json</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded p-3" style={{ borderColor: `${c}30` }}>
          <p className="text-xs opacity-50 mb-1">{"{"} "from": {"{"}</p>
          <p className="ml-4 font-bold">{data.companyName}</p><p className="ml-4 text-xs opacity-60">{data.companyAddress}</p>
          <p className="text-xs opacity-50">{"}"} {"}"}</p>
        </div>
        <div className="border rounded p-3" style={{ borderColor: `${c}30` }}>
          <p className="text-xs opacity-50 mb-1">{"{"} "to": {"{"}</p>
          <p className="ml-4 font-bold">{data.clientName || "null"}</p><p className="ml-4 text-xs opacity-60">{data.clientAddress || "null"}</p>
          <p className="text-xs opacity-50">{"}"} {"}"}</p>
        </div>
      </div>
      <p className="text-xs opacity-50 mb-1">$ cat items.csv</p>
      <ItemsTable data={data} headerBg={`${c}20`} headerText={c} stripeBg={`${c}05`} borderColor={`${c}15`} />
      <Totals data={data} accentColor={c} labelClass="opacity-60" />
      <Footer data={data} labelClass="opacity-50" />
    </div>
  )
}

// ── 3. KINETIC: Energetic diagonal stripes, dynamic angles ──
export function KineticTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-zinc-950 text-white font-sans text-sm min-h-[842px] w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ background: `linear-gradient(135deg, ${c}, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5" style={{ background: `linear-gradient(315deg, ${c}, transparent)` }} />
      <div className="p-8 relative z-10">
        <div className="flex justify-between items-center mb-8 pb-6" style={{ borderBottom: `3px solid ${c}` }}>
          <div className="flex items-center gap-3">
            {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto" />}
            <div><h1 className="text-3xl font-black italic tracking-tighter" style={{ color: c }}>INVOICE</h1><p className="text-xs text-zinc-500">#{String(data.serialNumber).padStart(4, "0")}</p></div>
          </div>
          <div className="text-right text-xs text-zinc-400"><p className="font-bold text-white">{data.companyName}</p><p>{data.companyAddress}</p></div>
        </div>
        <MetaRow data={data} labelClass="text-zinc-500" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl p-4 border-l-4" style={{ borderColor: c }}><p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>From</p><p className="font-bold">{data.companyName}</p><p className="text-xs text-zinc-400">{data.companyAddress}</p></div>
          <div className="bg-zinc-900 rounded-xl p-4 border-l-4" style={{ borderColor: c }}><p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>To</p><p className="font-bold">{data.clientName || "—"}</p><p className="text-xs text-zinc-400">{data.clientAddress || "—"}</p></div>
        </div>
        <ItemsTable data={data} headerBg={c} headerText="#000" stripeBg="rgba(255,255,255,0.02)" borderColor="rgba(255,255,255,0.06)" />
        <Totals data={data} accentColor={c} labelClass="text-zinc-500" />
        <Footer data={data} labelClass="text-zinc-500" />
      </div>
    </div>
  )
}

// ── 4. ART DECO: 1920s glamour, gold accents, double borders, centered ──
export function ArtDecoTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#1a1a2e] min-h-[842px] w-full p-10 text-sm" style={{ color: c, fontFamily: "Georgia, serif", border: `4px double ${c}` }}>
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px flex-1" style={{ backgroundColor: c }} />
          <span className="text-3xl">◆</span>
          <div className="h-px flex-1" style={{ backgroundColor: c }} />
        </div>
        {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-14 w-auto mx-auto mb-3" />}
        <h1 className="text-4xl font-bold tracking-[0.3em] uppercase">INVOICE</h1>
        <p className="text-sm opacity-60 mt-2 tracking-widest">No. {String(data.serialNumber).padStart(4, "0")}</p>
        <p className="text-xs opacity-40 mt-1 tracking-widest uppercase">{data.companyName}</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-8 text-xs border-y py-6" style={{ borderColor: `${c}40` }}>
        <div><p className="uppercase tracking-[0.2em] font-bold mb-2 opacity-60">Billed By</p><p className="font-bold text-sm">{data.companyName}</p><p className="opacity-60">{data.companyAddress}</p></div>
        <div className="text-right"><p className="uppercase tracking-[0.2em] font-bold mb-2 opacity-60">Billed To</p><p className="font-bold text-sm">{data.clientName || "—"}</p><p className="opacity-60">{data.clientAddress || "—"}</p></div>
      </div>
      <div className="flex gap-6 text-xs mb-6 justify-center opacity-60">
        <span>Date: {data.date}</span>{data.dueDate && <span>Due: {data.dueDate}</span>}<span>Currency: {data.currency}</span>
      </div>
      <ItemsTable data={data} headerBg={`${c}25`} headerText={c} stripeBg={`${c}08`} borderColor={`${c}20`} />
      <Totals data={data} accentColor={c} labelClass="opacity-50" />
      <Footer data={data} labelClass="opacity-40" />
    </div>
  )
}

// ── 5. BOLD TYPOGRAPHY: Oversized type, dark bg, text-driven design ──
export function BoldTypographyTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#111] text-white p-10 font-sans text-sm min-h-[842px] w-full">
      <h1 className="text-7xl font-black tracking-tighter leading-none mb-2" style={{ color: c }}>INV</h1>
      <p className="text-2xl font-bold text-gray-500 mb-8">#{String(data.serialNumber).padStart(4, "0")}</p>
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto" />}
          <div><p className="font-bold text-lg">{data.companyName}</p><p className="text-xs text-gray-500">{data.companyAddress}</p></div>
        </div>
        <div className="text-right text-xs text-gray-500"><p>Date: {data.date}</p>{data.dueDate && <p>Due: {data.dueDate}</p>}<p>{data.currency}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div><p className="text-3xl font-black tracking-tight mb-2" style={{ color: c }}>FROM</p><p className="font-bold">{data.companyName}</p><p className="text-xs text-gray-500">{data.companyAddress}</p></div>
        <div><p className="text-3xl font-black tracking-tight mb-2" style={{ color: c }}>TO</p><p className="font-bold">{data.clientName || "—"}</p><p className="text-xs text-gray-500">{data.clientAddress || "—"}</p></div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#111" stripeBg="rgba(255,255,255,0.03)" borderColor="rgba(255,255,255,0.08)" />
      <Totals data={data} accentColor={c} labelClass="text-gray-500" />
      <Footer data={data} labelClass="text-gray-600" />
    </div>
  )
}

// ── 6. CYBERPUNK: Glitch borders, neon glow, scanlines ──
export function CyberpunkTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#050510] text-sm min-h-[842px] w-full p-8 font-mono" style={{ color: c, border: `2px solid ${c}`, boxShadow: `0 0 20px ${c}30, inset 0 0 20px ${c}10` }}>
      <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: `1px solid ${c}40` }}>
        <div>
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-8 w-auto mb-2" style={{ filter: `drop-shadow(0 0 4px ${c})` }} />}
          <h1 className="text-3xl font-bold tracking-widest" style={{ textShadow: `0 0 10px ${c}` }}>INVOICE</h1>
          <p className="text-xs opacity-50 mt-1">ID://{String(data.serialNumber).padStart(4, "0")}</p>
        </div>
        <div className="text-right text-xs opacity-70"><p className="font-bold">{data.companyName}</p><p>{data.companyAddress}</p></div>
      </div>
      <div className="flex gap-4 text-xs mb-6 opacity-60">
        <span>[DATE: {data.date}]</span>{data.dueDate && <span>[DUE: {data.dueDate}]</span>}<span>[{data.currency}]</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded" style={{ border: `1px solid ${c}40`, backgroundColor: `${c}08` }}><p className="text-[10px] uppercase tracking-widest mb-2 opacity-50">&gt; SENDER</p><p className="font-bold">{data.companyName}</p><p className="text-xs opacity-60">{data.companyAddress}</p></div>
        <div className="p-4 rounded" style={{ border: `1px solid ${c}40`, backgroundColor: `${c}08` }}><p className="text-[10px] uppercase tracking-widest mb-2 opacity-50">&gt; RECIPIENT</p><p className="font-bold">{data.clientName || "NULL"}</p><p className="text-xs opacity-60">{data.clientAddress || "NULL"}</p></div>
      </div>
      <ItemsTable data={data} headerBg={`${c}20`} headerText={c} stripeBg={`${c}05`} borderColor={`${c}15`} />
      <Totals data={data} accentColor={c} labelClass="opacity-50" />
      <Footer data={data} labelClass="opacity-40" />
    </div>
  )
}

// ── 7. WEB3: Dark gradient, glass cards, pill badges ──
export function Web3Theme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="text-white font-sans text-sm min-h-[842px] w-full p-8" style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)" }}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-10 w-auto rounded-xl" />}
          <div><h1 className="text-xl font-bold" style={{ color: c }}>Invoice</h1><p className="text-xs text-gray-500">#{String(data.serialNumber).padStart(4, "0")}</p></div>
        </div>
        <div className="flex gap-2 text-[10px]">
          <span className="px-2 py-1 rounded-full bg-white/10">{data.date}</span>
          <span className="px-2 py-1 rounded-full bg-white/10">{data.currency}</span>
          {data.dueDate && <span className="px-2 py-1 rounded-full bg-white/10">Due: {data.dueDate}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="backdrop-blur-sm rounded-2xl p-5 border border-white/10" style={{ backgroundColor: `${c}08` }}><p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>From</p><p className="font-bold">{data.companyName}</p><p className="text-xs text-gray-400">{data.companyAddress}</p></div>
        <div className="backdrop-blur-sm rounded-2xl p-5 border border-white/10" style={{ backgroundColor: `${c}08` }}><p className="text-[10px] uppercase font-bold mb-2" style={{ color: c }}>To</p><p className="font-bold">{data.clientName || "—"}</p><p className="text-xs text-gray-400">{data.clientAddress || "—"}</p></div>
      </div>
      <ItemsTable data={data} headerBg={c} headerText="#000" stripeBg="rgba(255,255,255,0.02)" borderColor="rgba(255,255,255,0.06)" />
      <Totals data={data} accentColor={c} labelClass="text-gray-500" />
      <Footer data={data} labelClass="text-gray-600" />
    </div>
  )
}

// ── 8. MINIMAL DARK: Ultra-clean dark, thin lines, no decoration ──
export function MinimalDarkTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="bg-[#111] text-gray-300 p-12 font-sans text-sm min-h-[842px] w-full">
      <div className="flex justify-between items-start mb-16">
        <div>
          {data.companyLogoUrl ? <img src={data.companyLogoUrl} alt="" className="h-8 w-auto mb-2 opacity-80" /> : <p className="text-lg font-light text-white">{data.companyName}</p>}
          <p className="text-xs text-gray-600">{data.companyAddress}</p>
        </div>
        <div className="text-right"><p className="text-3xl font-light" style={{ color: c }}>Invoice</p><p className="text-xs text-gray-600 mt-1">#{String(data.serialNumber).padStart(4, "0")}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-16 mb-12 text-xs">
        <div><p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Bill To</p><p className="font-medium text-white">{data.clientName || "—"}</p><p className="text-gray-500 mt-0.5">{data.clientAddress || "—"}</p></div>
        <div className="text-right"><p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Details</p><p>Date: {data.date}</p>{data.dueDate && <p>Due: {data.dueDate}</p>}<p>{data.currency}</p></div>
      </div>
      <ItemsTable data={data} headerBg="transparent" headerText={c} stripeBg="rgba(255,255,255,0.02)" borderColor="rgba(255,255,255,0.06)" />
      <div className="flex justify-end mb-12">
        <div className="w-48 space-y-1 text-xs">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(data.subtotal, data.currency)}</span></div>
          {data.discount > 0 && <div className="flex justify-between text-gray-500"><span>Discount</span><span>-{formatCurrency(data.discount, data.currency)}</span></div>}
          {data.taxRate > 0 && <div className="flex justify-between text-gray-500"><span>Tax ({data.taxRate}%)</span><span>{formatCurrency(data.taxAmount, data.currency)}</span></div>}
          <div className="h-px my-2" style={{ backgroundColor: c }} />
          <div className="flex justify-between font-medium text-sm text-white"><span>Total</span><span>{formatCurrency(data.total, data.currency)}</span></div>
        </div>
      </div>
      <Footer data={data} labelClass="text-gray-600" />
    </div>
  )
}

// ── 9. VAPORWAVE: Pink/cyan gradient, retro-futuristic, italic serif ──
export function VaporwaveTheme({ data }: { data: InvoiceData }) {
  const c = data.accentColor
  return (
    <div className="text-white font-sans text-sm min-h-[842px] w-full p-8" style={{ background: "linear-gradient(180deg, #2d1b69 0%, #1a0533 40%, #0a0a2e 100%)" }}>
      <div className="text-center mb-10">
        {data.companyLogoUrl && <img src={data.companyLogoUrl} alt="" className="h-12 w-auto mx-auto mb-3" />}
        <h1 className="text-5xl font-bold italic tracking-wider" style={{ color: c, textShadow: `0 0 20px ${c}60` }}>ＩＮＶＯＩＣＥ</h1>
        <p className="text-sm mt-2 opacity-50 tracking-[0.3em]">#{String(data.serialNumber).padStart(4, "0")}</p>
        <p className="text-xs opacity-30 tracking-widest mt-1">{data.companyName}</p>
      </div>
      <div className="flex justify-center gap-6 text-xs mb-8 opacity-50">
        <span>{data.date}</span>{data.dueDate && <span>Due: {data.dueDate}</span>}<span>{data.currency}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-5 border" style={{ borderColor: `${c}30`, backgroundColor: `${c}08` }}>
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: c }}>From</p>
          <p className="font-bold">{data.companyName}</p><p className="text-xs opacity-50">{data.companyAddress}</p>
        </div>
        <div className="rounded-xl p-5 border" style={{ borderColor: `${c}30`, backgroundColor: `${c}08` }}>
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: c }}>To</p>
          <p className="font-bold">{data.clientName || "—"}</p><p className="text-xs opacity-50">{data.clientAddress || "—"}</p>
        </div>
      </div>
      <ItemsTable data={data} headerBg={`${c}25`} headerText={c} stripeBg={`${c}05`} borderColor={`${c}15`} />
      <Totals data={data} accentColor={c} labelClass="opacity-40" />
      <Footer data={data} labelClass="opacity-30" />
    </div>
  )
}
