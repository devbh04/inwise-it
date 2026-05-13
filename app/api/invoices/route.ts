import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET /api/invoices — List invoices for current user
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const q = searchParams.get("q")?.toLowerCase() || ""
  const status = searchParams.get("status") || ""

  const invoices = await db.invoice.findMany({
    where: {
      userId,
      ...(status && status !== "all" ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  // Client-side-like search filtering (SQLite doesn't have great full-text search)
  const filtered = q
    ? invoices.filter(
        (inv) =>
          inv.companyName.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q) ||
          `INV-${String(inv.serialNumber).padStart(4, "0")}`.toLowerCase().includes(q) ||
          inv.status.toLowerCase().includes(q)
      )
    : invoices

  return NextResponse.json(filtered)
}

// POST /api/invoices — Create a new invoice
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  // Get next serial number for this user
  const count = await db.invoice.count({ where: { userId } })
  const serialNumber = count + 1

  const invoice = await db.invoice.create({
    data: {
      userId,
      serialNumber,
      templateId: body.templateId || "classic",
      accentColor: body.accentColor || "#7c3aed",
      companyName: body.companyName || "",
      companyAddress: body.companyAddress || "",
      companyLogoId: body.companyLogoId || null,
      companySigId: body.companySigId || null,
      companyFields: JSON.stringify(body.companyFields || []),
      clientName: body.clientName || "",
      clientAddress: body.clientAddress || "",
      clientFields: JSON.stringify(body.clientFields || []),
      date: body.date ? new Date(body.date) : new Date(),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      currency: body.currency || "USD",
      notes: body.notes || null,
      terms: body.terms || null,
      items: JSON.stringify(body.items || []),
      subtotal: body.subtotal || 0,
      taxRate: body.taxRate || 0,
      taxAmount: body.taxAmount || 0,
      discount: body.discount || 0,
      total: body.total || 0,
      status: body.status || "draft",
    },
  })

  return NextResponse.json(invoice, { status: 201 })
}
