import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = req.nextUrl.searchParams.get('session_id')
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey || stripeKey.startsWith('sk_test_placeholder')) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2025-03-31.basil' })

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const workshopId = checkoutSession.metadata?.workshopId
    const userId = checkoutSession.metadata?.userId

    if (!workshopId || !userId) {
      return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 })
    }

    const workshop = await prisma.workshop.findUnique({ where: { id: workshopId } })
    if (!workshop) return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })

    // Idempotent: check if already booked
    const existing = await prisma.booking.findFirst({
      where: { stripeSessionId: sessionId },
    })

    if (!existing) {
      await prisma.booking.create({
        data: {
          userId,
          workshopId,
          stripeSessionId: sessionId,
          amountCents: checkoutSession.amount_total || workshop.priceCents,
          status: 'CONFIRMED',
        },
      })
    }

    return NextResponse.json({ workshop })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 })
  }
}
