"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { formatCurrency } from "@/lib/invoice-types"

interface Invoice {
  id: string; serialNumber: number; companyName: string; clientName: string
  date: string; total: number; currency: string; status: string; templateId: string
}

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const fetchInvoices = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (statusFilter !== "all") params.set("status", statusFilter)
    const res = await fetch(`/api/invoices?${params}`)
    if (res.ok) setInvoices(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchInvoices() }, [search, statusFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return
    await fetch(`/api/invoices/${id}`, { method: "DELETE" })
    fetchInvoices()
  }

  const statusColor: Record<string, string> = {
    draft: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    sent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  }

  return (
    <div className="bg-sidebar">
      <div className="flex flex-col h-svh rounded-3xl bg-background border-8 border-sidebar">
        <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center gap-2 p-2 px-4 border-b border-border shrink-0">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
              <Link href="/create" className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors">
                + New Invoice
              </Link>
            </div>
          </header>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Invoices</h1>

              {/* Search & Filters */}
              <div className="flex gap-3 mb-6">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by invoice #, company, client..."
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm"
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Table */}
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 rounded-lg bg-muted/50 animate-pulse" />
                  ))}
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mx-auto mb-4 size-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8 text-indigo-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No invoices yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first invoice to get started.</p>
                  <Link href="/create" className="inline-flex rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Create Invoice</Link>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left px-4 py-3 font-medium">Invoice #</th>
                        <th className="text-left px-4 py-3 font-medium">Client</th>
                        <th className="text-left px-4 py-3 font-medium">Date</th>
                        <th className="text-right px-4 py-3 font-medium">Amount</th>
                        <th className="text-center px-4 py-3 font-medium">Status</th>
                        <th className="text-right px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => (
                        <tr key={inv.id} className="border-t border-border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => router.push(`/invoices/${inv.id}`)}>
                          <td className="px-4 py-3 font-medium">INV-{String(inv.serialNumber).padStart(4, "0")}</td>
                          <td className="px-4 py-3 text-muted-foreground">{inv.clientName || "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatCurrency(inv.total, inv.currency)}</td>
                          <td className="px-4 py-3 text-center"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor[inv.status] || ""}`}>{inv.status}</span></td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={e => { e.stopPropagation(); router.push(`/create?edit=${inv.id}`) }} className="text-xs text-indigo-500 hover:underline mr-3">Edit</button>
                            <button onClick={e => { e.stopPropagation(); handleDelete(inv.id) }} className="text-xs text-destructive hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
