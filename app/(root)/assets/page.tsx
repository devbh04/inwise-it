"use client"

import { useState, useEffect, useRef } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

interface Asset {
  id: string; name: string; type: string; dataUrl: string; createdAt: string
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [tab, setTab] = useState<"logo" | "signature">("logo")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchAssets = async () => {
    setLoading(true)
    const res = await fetch("/api/assets")
    if (res.ok) setAssets(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchAssets() }, [])

  const filtered = assets.filter(a => a.type === tab)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, type: tab, dataUrl }),
      })
      fetchAssets()
      setUploading(false)
    }
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this asset?")) return
    await fetch(`/api/assets/${id}`, { method: "DELETE" })
    fetchAssets()
  }

  return (
    <div className="bg-sidebar">
      <div className="flex flex-col h-svh rounded-3xl bg-background border-8 border-sidebar">
        <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center gap-2 p-2 px-4 border-b border-border shrink-0">
            <SidebarTrigger />
            <div className="ml-auto"><ModeToggle /></div>
          </header>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Manage Assets</h1>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 p-1 rounded-lg bg-muted/50 w-fit">
                <button onClick={() => setTab("logo")} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === "logo" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  Logos
                </button>
                <button onClick={() => setTab("signature")} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === "signature" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  Signatures
                </button>
              </div>

              {/* Upload */}
              <div className="mb-6">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-lg border border-dashed border-border px-6 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-50">
                  {uploading ? "Uploading..." : `+ Upload ${tab === "logo" ? "Logo" : "Signature"}`}
                </button>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="aspect-square rounded-xl bg-muted/50 animate-pulse" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 size-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8 text-indigo-500"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No {tab === "logo" ? "logos" : "signatures"} yet</h3>
                  <p className="text-sm text-muted-foreground">Upload your first {tab} to use in invoices.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filtered.map(asset => (
                    <div key={asset.id} className="group relative rounded-xl border border-border overflow-hidden hover:border-indigo-500/30 transition-colors">
                      <div className="aspect-square bg-muted/30 flex items-center justify-center p-4">
                        <img src={asset.dataUrl} alt={asset.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="p-3 border-t border-border">
                        <p className="text-xs font-medium truncate">{asset.name}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(asset.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => handleDelete(asset.id)} className="absolute top-2 right-2 size-7 rounded-lg bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
