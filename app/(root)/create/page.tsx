"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { InvoicePreview } from "@/components/templates"
import { InvoiceData, TEMPLATES, CURRENCIES } from "@/lib/invoice-types"
import {
  createDefaultInvoiceData, recalculateTotals, addItem, removeItem, updateItem,
  addCustomField, removeCustomField, updateCustomField,
} from "@/lib/invoice-helpers"
import { HexColorPicker } from "react-colorful"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Suspense } from "react"

type Section = "company" | "client" | "invoice" | "items" | "additional"

function CreateInvoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const templateParam = searchParams.get("template")
  const previewRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState<InvoiceData>(createDefaultInvoiceData)
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(["company"]))
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [assets, setAssets] = useState<{ id: string; name: string; type: string; dataUrl: string }[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit")

  useEffect(() => { fetch("/api/assets").then(r => r.json()).then(setAssets).catch(() => {}) }, [])

  useEffect(() => {
    if (editId) {
      fetch(`/api/invoices/${editId}`).then(r => r.json()).then(inv => {
        setData({
          ...inv,
          invoicePrefix: inv.invoicePrefix || "INV",
          isDarkMode: inv.isDarkMode ?? false,
          paymentTerms: inv.paymentTerms || null,
          date: inv.date?.split("T")[0] || new Date().toISOString().split("T")[0],
          dueDate: inv.dueDate?.split("T")[0] || null,
          items: (typeof inv.items === "string" ? JSON.parse(inv.items) : inv.items).map((it: any) => ({
            title: it.title || it.description || "", description: it.description || "",
            qty: it.qty || 0, price: it.price || 0, discount: it.discount || 0,
            discountedPrice: (it.price || 0) - (it.discount || 0),
          })),
          companyFields: typeof inv.companyFields === "string" ? JSON.parse(inv.companyFields) : inv.companyFields,
          clientFields: typeof inv.clientFields === "string" ? JSON.parse(inv.clientFields) : inv.clientFields,
          companyLogoUrl: null, companySignatureUrl: null,
        })
        if (inv.companyLogoId) {
          fetch("/api/assets").then(r => r.json()).then((a: typeof assets) => {
            const logo = a.find((x: typeof assets[0]) => x.id === inv.companyLogoId)
            const sig = a.find((x: typeof assets[0]) => x.id === inv.companySigId)
            setData(prev => ({ ...prev, companyLogoUrl: logo?.dataUrl || null, companySignatureUrl: sig?.dataUrl || null }))
          })
        }
        setHasLoaded(true)
      })
    } else {
      const stored = sessionStorage.getItem("invoice-draft")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (templateParam && parsed.templateId !== templateParam) {
            const tmpl = TEMPLATES.find(t => t.id === templateParam)
            if (tmpl) { parsed.templateId = templateParam; parsed.accentColor = tmpl.presets[0].color }
          }
          setData(parsed)
        } catch {}
      } else if (templateParam) {
        const tmpl = TEMPLATES.find(t => t.id === templateParam)
        if (tmpl) setData(prev => recalculateTotals({ ...prev, templateId: templateParam, accentColor: tmpl.presets[0].color }))
      }
      setHasLoaded(true)
    }
  }, [editId, templateParam])

  useEffect(() => {
    if (!editId && hasLoaded) sessionStorage.setItem("invoice-draft", JSON.stringify(data))
  }, [data, editId, hasLoaded])

  const update = useCallback((partial: Partial<InvoiceData>) => {
    setData(prev => recalculateTotals({ ...prev, ...partial }))
  }, [])

  const toggleSection = (s: Section) => {
    setOpenSections(prev => { const next = new Set(prev); next.has(s) ? next.delete(s) : next.add(s); return next })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editId ? `/api/invoices/${editId}` : "/api/invoices"
      const method = editId ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (res.ok) { sessionStorage.removeItem("invoice-draft"); const inv = await res.json(); router.push(`/invoices/${inv.id}`) }
    } finally { setSaving(false) }
  }

  const handleDownload = async () => {
    const { generatePDF } = await import("@/lib/pdf")
    await generatePDF(`${data.invoicePrefix}-${String(data.serialNumber).padStart(4, "0")}.pdf`, data)
    sessionStorage.removeItem("invoice-draft")
  }

  const handleClear = () => {
    if (!confirm("Clear all invoice data? This cannot be undone.")) return
    const fresh = createDefaultInvoiceData()
    fresh.templateId = data.templateId
    fresh.accentColor = data.accentColor
    setData(fresh)
    sessionStorage.removeItem("invoice-draft")
  }

  const logos = assets.filter(a => a.type === "logo")
  const signatures = assets.filter(a => a.type === "signature")
  const selectedTheme = TEMPLATES.find(t => t.id === data.templateId)

  const SectionHeader = ({ id, label }: { id: Section; label: string }) => (
    <button onClick={() => toggleSection(id)} className="flex w-full items-center justify-between py-4 border-b border-border text-left">
      <span className="text-sm font-semibold">{label}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`size-5 text-muted-foreground transition-transform ${openSections.has(id) ? "rotate-180" : ""}`}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" /></svg>
    </button>
  )

  return (
    <div className="bg-sidebar">
      <div className="flex flex-col h-svh rounded-3xl bg-background border-8 border-sidebar">
        <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center gap-2 p-2 px-4 border-b border-border shrink-0 overflow-x-auto scrollbar-hide">
            <SidebarTrigger className="shrink-0" />
            
            {/* Mobile View Toggle */}
            <div className="flex lg:hidden bg-muted rounded-lg p-0.5 ml-1 shrink-0">
              <button onClick={() => setMobileView("edit")} className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md ${mobileView === 'edit' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>Edit</button>
              <button onClick={() => setMobileView("preview")} className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md ${mobileView === 'preview' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>Preview</button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
              <ModeToggle />
              <button onClick={handleClear} className="rounded-lg border border-border px-2 sm:px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">Clear</button>
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-4 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
              <button onClick={handleDownload} className="rounded-lg bg-violet-600 hover:bg-violet-700 px-3 sm:px-4 py-1.5 text-xs font-semibold text-white transition-colors flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5"><path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" /><path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" /></svg>
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left — Editor */}
            <div className={`w-full lg:w-1/2 border-r border-border overflow-y-auto p-4 sm:p-6 space-y-0 ${mobileView === 'edit' ? 'block' : 'hidden lg:block'}`}>
              {/* Template selector */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">Template</span>
                <Select value={data.templateId} onValueChange={v => update({ templateId: v, accentColor: TEMPLATES.find(t => t.id === v)?.presets[0].color || data.accentColor })}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>{TEMPLATES.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Accent Color */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold">Accent Color</span>
                <div className="flex items-center gap-1.5">
                  {selectedTheme?.presets.map(p => (
                    <button key={p.name} onClick={() => update({ accentColor: p.color })} title={p.name}
                      className={`size-6 rounded-full border shadow-sm transition-all ${data.accentColor === p.color ? 'ring-2 ring-indigo-500 ring-offset-1 border-transparent' : 'border-black/10 hover:scale-110'}`}
                      style={{ backgroundColor: p.color }} />
                  ))}
                  <div className="w-px h-5 bg-border mx-0.5" />
                  <div className="relative">
                    <button onClick={() => setShowColorPicker(!showColorPicker)} className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-xs">
                      <div className="size-3.5 rounded" style={{ backgroundColor: data.accentColor }} />
                      {data.accentColor}
                    </button>
                    {showColorPicker && (
                      <div className="absolute right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl p-3 shadow-xl">
                        <HexColorPicker color={data.accentColor} onChange={c => update({ accentColor: c })} />
                        <input value={data.accentColor} onChange={e => update({ accentColor: e.target.value })} className="mt-2 w-full rounded border border-border bg-background px-2 py-1 text-xs" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <SectionHeader id="company" label="Company Details" />
              {openSections.has("company") && (
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Company Logo</label>
                      <Select value="" onValueChange={v => { const a = logos.find(x => x.id === v); update({ companyLogoUrl: a?.dataUrl || null }) }}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="None" /></SelectTrigger>
                        <SelectContent><SelectItem value="none">None</SelectItem>{logos.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Signature</label>
                      <Select value="" onValueChange={v => { const a = signatures.find(x => x.id === v); update({ companySignatureUrl: a?.dataUrl || null }) }}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="None" /></SelectTrigger>
                        <SelectContent><SelectItem value="none">None</SelectItem>{signatures.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><label className="text-xs font-medium mb-1 block">Company Name</label><textarea value={data.companyName} onChange={e => update({ companyName: e.target.value })} rows={1} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="Your company name" /></div>
                  <div><label className="text-xs font-medium mb-1 block">Company Address</label><textarea value={data.companyAddress} onChange={e => update({ companyAddress: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="123 Main St, City" /></div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Custom Fields</label>
                    {data.companyFields.map((f, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <textarea value={f.label} onChange={e => update({ companyFields: updateCustomField(data.companyFields, i, "label", e.target.value) })} rows={1} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs resize-none" placeholder="Label" />
                        <textarea value={f.value} onChange={e => update({ companyFields: updateCustomField(data.companyFields, i, "value", e.target.value) })} rows={1} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs resize-none" placeholder="Value" />
                        <button onClick={() => update({ companyFields: removeCustomField(data.companyFields, i) })} className="text-destructive text-xs px-2">✕</button>
                      </div>
                    ))}
                    <button onClick={() => update({ companyFields: addCustomField(data.companyFields) })} className="text-xs text-indigo-500 hover:underline">+ Add Field</button>
                  </div>
                </div>
              )}

              {/* Client Details */}
              <SectionHeader id="client" label="Client Details" />
              {openSections.has("client") && (
                <div className="py-4 space-y-4">
                  <div><label className="text-xs font-medium mb-1 block">Client Name</label><textarea value={data.clientName} onChange={e => update({ clientName: e.target.value })} rows={1} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="Client name" /></div>
                  <div><label className="text-xs font-medium mb-1 block">Client Address</label><textarea value={data.clientAddress} onChange={e => update({ clientAddress: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="Client address" /></div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Custom Fields</label>
                    {data.clientFields.map((f, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <textarea value={f.label} onChange={e => update({ clientFields: updateCustomField(data.clientFields, i, "label", e.target.value) })} rows={1} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs resize-none" placeholder="Label" />
                        <textarea value={f.value} onChange={e => update({ clientFields: updateCustomField(data.clientFields, i, "value", e.target.value) })} rows={1} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs resize-none" placeholder="Value" />
                        <button onClick={() => update({ clientFields: removeCustomField(data.clientFields, i) })} className="text-destructive text-xs px-2">✕</button>
                      </div>
                    ))}
                    <button onClick={() => update({ clientFields: addCustomField(data.clientFields) })} className="text-xs text-indigo-500 hover:underline">+ Add Field</button>
                  </div>
                </div>
              )}

              {/* Invoice Details */}
              <SectionHeader id="invoice" label="Invoice Details" />
              {openSections.has("invoice") && (
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="text-xs font-medium mb-1 block">Prefix</label><textarea value={data.invoicePrefix} onChange={e => update({ invoicePrefix: e.target.value })} rows={1} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="INV" /></div>
                    <div><label className="text-xs font-medium mb-1 block">Serial #</label><input type="number" value={data.serialNumber} onChange={e => update({ serialNumber: Number(e.target.value) })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" min={1} /></div>
                    <div><label className="text-xs font-medium mb-1 block">Currency</label>
                      <Select value={data.currency} onValueChange={v => update({ currency: v })}>
                        <SelectTrigger className="w-full h-9.5"><SelectValue /></SelectTrigger>
                        <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium mb-1 block">Date</label><input type="date" value={data.date} onChange={e => update({ date: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-medium mb-1 block">Due Date</label><input type="date" value={data.dueDate || ""} onChange={e => update({ dueDate: e.target.value || null })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></div>
                  </div>
                  <div><label className="text-xs font-medium mb-1 block">Payment Terms</label><textarea value={data.paymentTerms || ""} onChange={e => update({ paymentTerms: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="Net 30, Due on receipt..." /></div>
                </div>
              )}

              {/* Invoice Items */}
              <SectionHeader id="items" label="Invoice Items" />
              {openSections.has("items") && (
                <div className="py-4 space-y-3">
                  {data.items.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <textarea value={item.title} onChange={e => setData(prev => updateItem(prev, i, "title", e.target.value))} rows={1} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold resize-none" placeholder="Item title" />
                        <button onClick={() => setData(prev => removeItem(prev, i))} className="text-destructive text-xs px-2 py-1.5 ml-2">✕</button>
                      </div>
                      <textarea value={item.description} onChange={e => setData(prev => updateItem(prev, i, "description", e.target.value))} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs resize-none" placeholder="Description (multiline)" />
                      <div className="flex gap-2">
                        <div className="flex-1"><label className="text-[10px] text-muted-foreground">Qty</label><input type="number" value={item.qty} onChange={e => setData(prev => updateItem(prev, i, "qty", Number(e.target.value)))} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-center" min={0} /></div>
                        <div className="flex-1"><label className="text-[10px] text-muted-foreground">Price</label><input type="number" value={item.price} onChange={e => setData(prev => updateItem(prev, i, "price", Number(e.target.value)))} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-right" min={0} step="0.01" /></div>
                        <div className="flex-1"><label className="text-[10px] text-muted-foreground">Discount</label><input type="number" value={item.discount} onChange={e => setData(prev => updateItem(prev, i, "discount", Number(e.target.value)))} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-right" min={0} step="0.01" /></div>
                        <div className="flex-1"><label className="text-[10px] text-muted-foreground">Final</label><div className="rounded-lg bg-muted px-2 py-1.5 text-xs text-right font-medium">{item.discountedPrice.toFixed(2)}</div></div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData(prev => addItem(prev))} className="w-full rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">+ Add Item</button>

                  {/* Live totals */}
                  <div className="border-t border-border pt-3 space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{data.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium">-{data.discount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax ({data.taxRate}%)</span><span className="font-medium">{data.taxAmount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm font-bold border-t border-border pt-2 mt-2"><span>Total</span><span>{data.total.toFixed(2)}</span></div>
                  </div>
                </div>
              )}

              {/* Additional */}
              <SectionHeader id="additional" label="Additional Information" />
              {openSections.has("additional") && (
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium mb-1 block">Tax Rate (%)</label><input type="number" value={data.taxRate} onChange={e => update({ taxRate: Number(e.target.value) })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" min={0} step="0.1" /></div>
                    <div><label className="text-xs font-medium mb-1 block">Discount</label><input type="number" value={data.discount} onChange={e => update({ discount: Number(e.target.value) })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" min={0} step="0.01" /></div>
                  </div>
                  <div><label className="text-xs font-medium mb-1 block">Notes</label><textarea value={data.notes || ""} onChange={e => update({ notes: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="Payment terms, thank you message..." /></div>
                  <div><label className="text-xs font-medium mb-1 block">Terms & Conditions</label><textarea value={data.terms || ""} onChange={e => update({ terms: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="Terms & conditions..." /></div>
                </div>
              )}
            </div>

            {/* Right — Preview */}
            <div className={`w-full lg:w-1/2 overflow-auto bg-muted/30 p-4 sm:p-6 ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
              <div ref={previewRef} className="mx-auto shadow-xl rounded-lg overflow-hidden shrink-0 bg-white" style={{ width: 595, minHeight: 842 }}>
                <InvoicePreview data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
      <CreateInvoiceContent />
    </Suspense>
  )
}
