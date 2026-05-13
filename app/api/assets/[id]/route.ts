import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// DELETE /api/assets/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.asset.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.asset.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
