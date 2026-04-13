import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: list user's bookings
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { workshop: true },
      orderBy: { bookedAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST: create a booking (mock mode)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workshopId } = await req.json()
    if (!workshopId) {
      return NextResponse.json({ error: 'Missing workshopId' }, { status: 400 })
    }

    const workshop = await prisma.workshop.findUnique({ where: { id: workshopId } })
    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check for duplicate
    const existing = await prisma.booking.findFirst({
      where: { userId: session.user.id, workshopId, status: 'CONFIRMED' },
    })
    if (existing) {
      return NextResponse.json({ booking: existing, alreadyBooked: true })
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        workshopId,
        amountCents: workshop.priceCents,
        status: 'CONFIRMED',
      },
    })

    return NextResponse.json({ booking })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
