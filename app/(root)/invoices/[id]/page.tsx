"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { InvoicePreview } from "@/components/templates"
import { InvoiceData } from "@/lib/invoice-types"

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const previewRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<InvoiceData | null>(null)
  const [assets, setAssets] = useState<{ id: string; dataUrl: string }[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/invoices/${id}`).then(r => r.json()),
      fetch("/api/assets").then(r => r.json()).catch(() => []),
    ]).then(([inv, a]) => {
      setAssets(a)
      const logo = a.find((x: typeof assets[0]) => x.id === inv.companyLogoId)
      const sig = a.find((x: typeof assets[0]) => x.id === inv.companySigId)
      setData({
        ...inv,
        date: inv.date?.split("T")[0] || "",
        dueDate: inv.dueDate?.split("T")[0] || null,
        items: typeof inv.items === "string" ? JSON.parse(inv.items) : inv.items,
        companyFields: typeof inv.companyFields === "string" ? JSON.parse(inv.companyFields) : inv.companyFields,
        clientFields: typeof inv.clientFields === "string" ? JSON.parse(inv.clientFields) : inv.clientFields,
        companyLogoUrl: logo?.dataUrl || null,
        companySignatureUrl: sig?.dataUrl || null,
      })
    })
  }, [id])

  const handleDownload = async () => {
    const el = previewRef.current
    if (!el) return
    const { generatePDF } = await import("@/lib/pdf")
    await generatePDF(el, `invoice-${String(data?.serialNumber || 0).padStart(4, "0")}.pdf`)
  }

  const handleDelete = async () => {
    if (!confirm("Delete this invoice?")) return
    await fetch(`/api/invoices/${id}`, { method: "DELETE" })
    router.push("/invoices")
  }

  if (!data) {
    return (
      <div className="bg-sidebar">
        <div className="flex flex-col h-svh rounded-3xl bg-background border-8 border-sidebar">
          <div className="border rounded-xl flex-1 flex items-center justify-center">
            <div className="size-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-sidebar">
      <div className="flex flex-col h-svh rounded-3xl bg-background border-8 border-sidebar">
        <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center gap-2 p-2 px-4 border-b border-border shrink-0">
            <SidebarTrigger />
            <button onClick={() => router.push("/invoices")} className="text-xs text-muted-foreground hover:text-foreground ml-2">← Back</button>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
              <button onClick={() => router.push(`/create?edit=${id}`)} className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium hover:bg-accent transition-colors">Edit</button>
              <button onClick={handleDelete} className="rounded-lg border border-destructive/30 text-destructive px-4 py-1.5 text-xs font-medium hover:bg-destructive/10 transition-colors">Delete</button>
              <button onClick={handleDownload} className="rounded-lg bg-violet-600 hover:bg-violet-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors">Download PDF</button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto bg-muted/30 p-8 flex justify-center">
            <div ref={previewRef} className="shadow-lg rounded-lg overflow-hidden w-[595px]">
              <InvoicePreview data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
