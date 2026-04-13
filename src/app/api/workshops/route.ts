import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const profession = searchParams.get('profession') || undefined
    const city = searchParams.get('city') || undefined
    const status = searchParams.get('status') || undefined

    const workshops = await prisma.workshop.findMany({
      where: {
        ...(profession ? { profession } : {}),
        ...(city ? { city } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: { _count: { select: { bookings: true } } },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(workshops)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const workshop = await prisma.workshop.create({ data: body })
    return NextResponse.json(workshop, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 })
  }
}
