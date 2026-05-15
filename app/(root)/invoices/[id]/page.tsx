"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { InvoicePreview } from "@/components/templates"
import { InvoiceData } from "@/lib/invoice-types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { GUEST_DOWNLOAD_LIMIT, getGuestDownloadCount, setGuestDownloadCount } from "@/lib/utils"

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const previewRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<InvoiceData | null>(null)
  const [assets, setAssets] = useState<{ id: string; dataUrl: string }[]>([])
  const [guestDownloads, setGuestDownloads] = useState(0)
  const [showGuestLimitDialog, setShowGuestLimitDialog] = useState(false)

  useEffect(() => {
    if (!isSignedIn) return
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
  }, [id, isSignedIn])

  useEffect(() => {
    if (!isSignedIn) {
      setGuestDownloads(getGuestDownloadCount())
      return
    }
    setGuestDownloads(0)
  }, [isSignedIn])

  const handleDownload = async () => {
    if (!data) return
    if (!isSignedIn) {
      const current = getGuestDownloadCount()
      if (current >= GUEST_DOWNLOAD_LIMIT) {
        setShowGuestLimitDialog(true)
        return
      }
      const next = current + 1
      setGuestDownloadCount(next)
      setGuestDownloads(next)
    }
    const { generatePDF } = await import("@/lib/pdf")
    await generatePDF(`invoice-${String(data.serialNumber).padStart(4, "0")}.pdf`, data)
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
      <AlertDialog open={showGuestLimitDialog} onOpenChange={setShowGuestLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 7.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75Z" clipRule="evenodd" />
              </svg>
            </AlertDialogMedia>
            <AlertDialogTitle>Download limit reached</AlertDialogTitle>
            <AlertDialogDescription>
              You have used {GUEST_DOWNLOAD_LIMIT} of {GUEST_DOWNLOAD_LIMIT} guest downloads. Create a free account to keep downloading invoices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/sign-up">Create free account</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-col h-svh rounded-3xl bg-background border-8 border-sidebar">
        <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center gap-2 p-2 px-4 border-b border-border shrink-0">
            <SidebarTrigger />
            <button onClick={() => router.push("/invoices")} className="text-xs text-muted-foreground hover:text-foreground ml-2">← Back</button>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
              <button onClick={() => router.push(`/create?edit=${id}`)} className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium hover:bg-accent transition-colors">Edit</button>
              <button onClick={handleDelete} className="rounded-lg border border-destructive/30 text-destructive px-4 py-1.5 text-xs font-medium hover:bg-destructive/10 transition-colors">Delete</button>
              {!isSignedIn && (
                <span className={`text-[11px] ${guestDownloads >= GUEST_DOWNLOAD_LIMIT ? "text-destructive" : "text-muted-foreground"}`}>
                  Downloads: {Math.min(guestDownloads, GUEST_DOWNLOAD_LIMIT)}/{GUEST_DOWNLOAD_LIMIT}
                </span>
              )}
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
