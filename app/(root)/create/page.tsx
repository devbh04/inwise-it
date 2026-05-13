"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { InvoicePreview } from "@/components/templates"
import { InvoiceData, TEMPLATES, CURRENCIES, CustomField } from "@/lib/invoice-types"
import {
  createDefaultInvoiceData,
  recalculateTotals,
  addItem,
  removeItem,
  updateItem,
  addCustomField,
  removeCustomField,
  updateCustomField,
} from "@/lib/invoice-helpers"
import { HexColorPicker } from "react-colorful"

import { Suspense } from "react"

type Section = "company" | "client" | "invoice" | "items" | "additional"

function CreateInvoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const previewRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState<InvoiceData>(createDefaultInvoiceData)
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(["company"]))
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [assets, setAssets] = useState<{ id: string; name: string; type: string; dataUrl: string }[]>([])

  // Load assets
  useEffect(() => {
    fetch("/api/assets").then(r => r.json()).then(setAssets).catch(() => {})
  }, [])

  // Load invoice if editing
  useEffect(() => {
    if (!editId) return
    fetch(`/api/invoices/${editId}`)
      .then(r => r.json())
      .then(inv => {
        setData({
          ...inv,
          date: inv.date?.split("T")[0] || new Date().toISOString().split("T")[0],
          dueDate: inv.dueDate?.split("T")[0] || null,
          items: typeof inv.items === "string" ? JSON.parse(inv.items) : inv.items,
          companyFields: typeof inv.companyFields === "string" ? JSON.parse(inv.companyFields) : inv.companyFields,
          clientFields: typeof inv.clientFields === "string" ? JSON.parse(inv.clientFields) : inv.clientFields,
          companyLogoUrl: null,
          companySignatureUrl: null,
        })
        // Resolve asset URLs
        if (inv.companyLogoId) {
          fetch("/api/assets").then(r => r.json()).then((a: typeof assets) => {
            const logo = a.find((x: typeof assets[0]) => x.id === inv.companyLogoId)
            const sig = a.find((x: typeof assets[0]) => x.id === inv.companySigId)
            setData(prev => ({ ...prev, companyLogoUrl: logo?.dataUrl || null, companySignatureUrl: sig?.dataUrl || null }))
          })
        }
      })
  }, [editId])

  const update = useCallback((partial: Partial<InvoiceData>) => {
    setData(prev => recalculateTotals({ ...prev, ...partial }))
  }, [])

  const toggleSection = (s: Section) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = {
        ...data,
        companyFields: data.companyFields,
        clientFields: data.clientFields,
        items: data.items,
      }
      const url = editId ? `/api/invoices/${editId}` : "/api/invoices"
      const method = editId ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (res.ok) {
        const inv = await res.json()
        router.push(`/invoices/${inv.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async () => {
    const el = previewRef.current
    if (!el) return
    const html2canvas = (await import("html2canvas")).default
    const jsPDF = (await import("jspdf")).default
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const w = pdf.internal.pageSize.getWidth()
    const h = (canvas.height * w) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, w, h)
    pdf.save(`invoice-${String(data.serialNumber).padStart(4, "0")}.pdf`)
  }

  const logos = assets.filter(a => a.type === "logo")
  const signatures = assets.filter(a => a.type === "signature")

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
          {/* Top bar */}
          <header className="flex items-center gap-2 p-2 px-4 border-b border-border shrink-0">
            <SidebarTrigger />
            <div className="flex items-center gap-2 ml-auto">
              <ModeToggle />
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={handleDownload} className="rounded-lg bg-violet-600 hover:bg-violet-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5"><path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" /><path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" /></svg>
                Download
              </button>
            </div>
          </header>

          {/* Split pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left — Editor */}
            <div className="w-1/2 border-r border-border overflow-y-auto p-6 space-y-0">
              {/* Template selector */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">Invoice Template</span>
                <select value={data.templateId} onChange={e => update({ templateId: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
                  {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              {/* Color picker */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold">Accent Color</span>
                <div className="relative">
                  <button onClick={() => setShowColorPicker(!showColorPicker)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs">
                    <div className="size-4 rounded" style={{ backgroundColor: data.accentColor }} />
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

              {/* Company Details */}
              <SectionHeader id="company" label="Company Details" />
              {openSections.has("company") && (
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Company Logo</label>
                      <select onChange={e => { const a = logos.find(x => x.id === e.target.value); update({ companyLogoUrl: a?.dataUrl || null }) }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs">
                        <option value="">None</option>
                        {logos.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Company Signature</label>
                      <select onChange={e => { const a = signatures.find(x => x.id === e.target.value); update({ companySignatureUrl: a?.dataUrl || null }) }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs">
                        <option value="">None</option>
                        {signatures.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Company Name</label>
                    <input value={data.companyName} onChange={e => update({ companyName: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Your company name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Company Address</label>
                    <textarea value={data.companyAddress} onChange={e => update({ companyAddress: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="123 Main St, City" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Company Fields</label>
                    {data.companyFields.map((f, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={f.label} onChange={e => update({ companyFields: updateCustomField(data.companyFields, i, "label", e.target.value) })} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" placeholder="Label" />
                        <input value={f.value} onChange={e => update({ companyFields: updateCustomField(data.companyFields, i, "value", e.target.value) })} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" placeholder="Value" />
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
                  <div>
                    <label className="text-xs font-medium mb-1 block">Client Name</label>
                    <input value={data.clientName} onChange={e => update({ clientName: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Client name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Client Address</label>
                    <textarea value={data.clientAddress} onChange={e => update({ clientAddress: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none" placeholder="Client address" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Client Fields</label>
                    {data.clientFields.map((f, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={f.label} onChange={e => update({ clientFields: updateCustomField(data.clientFields, i, "label", e.target.value) })} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" placeholder="Label" />
                        <input value={f.value} onChange={e => update({ clientFields: updateCustomField(data.clientFields, i, "value", e.target.value) })} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" placeholder="Value" />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium mb-1 block">Date</label><input type="date" value={data.date} onChange={e => update({ date: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-medium mb-1 block">Due Date</label><input type="date" value={data.dueDate || ""} onChange={e => update({ dueDate: e.target.value || null })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></div>
                  </div>
                  <div><label className="text-xs font-medium mb-1 block">Currency</label>
                    <select value={data.currency} onChange={e => update({ currency: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                      {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Invoice Items */}
              <SectionHeader id="items" label="Invoice Items" />
              {openSections.has("items") && (
                <div className="py-4 space-y-3">
                  {data.items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input value={item.description} onChange={e => setData(prev => updateItem(prev, i, "description", e.target.value))} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" placeholder="Description" />
                      <input type="number" value={item.qty} onChange={e => setData(prev => updateItem(prev, i, "qty", Number(e.target.value)))} className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-center" min={0} />
                      <input type="number" value={item.price} onChange={e => setData(prev => updateItem(prev, i, "price", Number(e.target.value)))} className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-right" min={0} step="0.01" />
                      <button onClick={() => setData(prev => removeItem(prev, i))} className="text-destructive text-xs px-2 py-1.5">✕</button>
                    </div>
                  ))}
                  <button onClick={() => setData(prev => addItem(prev))} className="w-full rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">+ Add Item</button>
                </div>
              )}

              {/* Additional Information */}
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
            <div className="w-1/2 overflow-y-auto bg-muted/30 p-6 flex justify-center">
              <div className="sticky top-0">
                <div ref={previewRef} className="shadow-lg rounded-lg overflow-hidden" style={{ transform: "scale(0.75)", transformOrigin: "top center" }}>
                  <InvoicePreview data={data} />
                </div>
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
