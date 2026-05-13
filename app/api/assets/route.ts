import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// GET /api/assets — List assets for current user
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const assets = await db.asset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(assets)
}

// POST /api/assets — Upload a new asset
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  if (!body.name || !body.type || !body.dataUrl) {
    return NextResponse.json(
      { error: "name, type, and dataUrl are required" },
      { status: 400 }
    )
  }

  if (!["logo", "signature"].includes(body.type)) {
    return NextResponse.json(
      { error: "type must be 'logo' or 'signature'" },
      { status: 400 }
    )
  }

  const asset = await db.asset.create({
    data: {
      userId,
      name: body.name,
      type: body.type,
      dataUrl: body.dataUrl,
    },
  })

  return NextResponse.json(asset, { status: 201 })
}
