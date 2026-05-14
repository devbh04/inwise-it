"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { InvoicePreview } from "@/components/templates"
import { InvoiceData, TEMPLATES } from "@/lib/invoice-types"
import { Input } from "@/components/ui/input"

const CATEGORIES = [
  { id: "all",          label: "All Templates" },
  { id: "professional", label: "Professional" },
  { id: "minimal",      label: "Minimal" },
  { id: "dark",         label: "Dark Mode" },
  { id: "creative",     label: "Creative" },
  { id: "specialty",    label: "Specialty" },
] as const

type CatId = typeof CATEGORIES[number]["id"]

function makeDemoData(templateId: string, accentColor: string): InvoiceData {
  return {
    invoicePrefix: "INV",
    serialNumber: 42,
    templateId,
    accentColor,
    isDarkMode: false,
    companyName: "Acme Studio",
    companyAddress: "123 Design Ave\nSan Francisco, CA",
    companyLogoUrl: null,
    companySignatureUrl: null,
    companyFields: [{ label: "GST", value: "27AADCA1234A1ZB" }],
    clientName: "Luca Moretti",
    clientAddress: "456 Client Blvd\nNew York, NY",
    clientFields: [],
    date: "2025-05-01",
    dueDate: "2025-05-31",
    currency: "USD",
    notes: null,
    terms: null,
    paymentTerms: null,
    items: [
      { title: "UI/UX Design", description: "Landing page redesign", qty: 3, price: 800, discount: 0, discountedPrice: 800 },
      { title: "Development", description: "Frontend implementation", qty: 10, price: 120, discount: 0, discountedPrice: 120 },
      { title: "Consulting", description: "Strategy session", qty: 2, price: 250, discount: 0, discountedPrice: 250 },
    ],
    subtotal: 3900,
    taxRate: 10,
    taxAmount: 390,
    discount: 0,
    total: 4290,
    status: "draft",
  }
}

export default function TemplatesPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<CatId>("all")
  const [search, setSearch] = useState("")

  const filteredTemplates = useMemo(() => {
    let list = activeCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter(t => t.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    }
    return list
  }, [activeCategory, search])

  const handleSelect = (templateId: string, accentColor: string) => {
    // Store the selected template in session so create page knows which template to use
    sessionStorage.setItem("invoice-selected-template", templateId)
    // Load existing shared draft if it exists and update its template
    const existing = sessionStorage.getItem("invoice-draft")
    if (existing) {
      try {
        const parsed = JSON.parse(existing)
        parsed.templateId = templateId
        parsed.accentColor = accentColor
        sessionStorage.setItem("invoice-draft", JSON.stringify(parsed))
      } catch {}
    }
    router.push(`/create?template=${templateId}`)
  }

  return (
    <div className="bg-sidebar">
      <div className="flex flex-col h-svh rounded-3xl bg-background border-8 border-sidebar">
        <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center gap-2 p-2 px-4 border-b border-border shrink-0">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>

          {/* Category tabs + search */}
          <div className="border-b border-border px-6 flex items-center gap-4 shrink-0">
            <div className="flex gap-1 overflow-x-auto flex-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeCategory === cat.id
                      ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                  <span className="ml-1 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                    {cat.id === "all" ? TEMPLATES.length : TEMPLATES.filter(t => t.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="shrink-0 w-56 py-2">
              <Input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Template grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">No templates match your search.</div>
            ) : (
              <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTemplates.map(t => {
                  const preview = makeDemoData(t.id, t.presets[0].color)
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelect(t.id, t.presets[0].color)}
                      className="cursor-pointer group border border-border bg-card hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                    >
                      {/* Live preview */}
                      <div className="relative overflow-hidden w-full bg-muted/10 border-b border-border flex justify-center" style={{ height: 320 }}>
                        <div
                          className="shrink-0"
                          style={{
                            width: 595,
                            height: 842,
                            transform: "scale(0.5)",
                            transformOrigin: "top center",
                            pointerEvents: "none",
                          }}
                        >
                          <InvoicePreview data={preview} />
                        </div>
                        {/* Mode badge */}
                        <div className={`absolute top-2 right-2 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full ${t.mode === "dark" ? "bg-zinc-700 text-zinc-300" : "bg-white text-gray-600 shadow-sm"}`}>
                          {t.mode === "dark" ? "Dark" : "Light"}
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 z-10 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">Use Template</span>
                        </div>
                      </div>

                      {/* Card footer */}
                      <div className="p-3 border-t border-border bg-card">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm truncate">{t.name}</h3>
                            <p className="text-[10px] text-muted-foreground truncate">{t.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {t.presets.map((p, i) => (
                            <div key={i} className="size-4 rounded-full border border-black/10 shadow-sm shrink-0" style={{ backgroundColor: p.color }} title={p.name} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
