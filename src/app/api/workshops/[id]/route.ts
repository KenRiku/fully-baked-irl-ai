import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    })
    if (!workshop) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(workshop)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch workshop' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { id } = await params
    const body = await req.json()
    const workshop = await prisma.workshop.update({ where: { id }, data: body })
    return NextResponse.json(workshop)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { id } = await params
    await prisma.workshop.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete workshop' }, { status: 500 })
  }
}
