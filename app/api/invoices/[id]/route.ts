import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET /api/invoices/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const invoice = await db.invoice.findFirst({
    where: { id, userId },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(invoice)
}

// PUT /api/invoices/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  // Verify ownership
  const existing = await db.invoice.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const invoice = await db.invoice.update({
    where: { id },
    data: {
      templateId: body.templateId,
      accentColor: body.accentColor,
      companyName: body.companyName,
      companyAddress: body.companyAddress,
      companyLogoId: body.companyLogoId,
      companySigId: body.companySigId,
      companyFields: body.companyFields ? JSON.stringify(body.companyFields) : undefined,
      clientName: body.clientName,
      clientAddress: body.clientAddress,
      clientFields: body.clientFields ? JSON.stringify(body.clientFields) : undefined,
      date: body.date ? new Date(body.date) : undefined,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      currency: body.currency,
      notes: body.notes,
      terms: body.terms,
      items: body.items ? JSON.stringify(body.items) : undefined,
      subtotal: body.subtotal,
      taxRate: body.taxRate,
      taxAmount: body.taxAmount,
      discount: body.discount,
      total: body.total,
      status: body.status,
    },
  })

  return NextResponse.json(invoice)
}

// DELETE /api/invoices/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.invoice.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.invoice.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
