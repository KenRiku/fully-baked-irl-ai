import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workshopId = req.nextUrl.searchParams.get('workshopId')
  if (!workshopId) {
    return NextResponse.json({ error: 'Missing workshopId' }, { status: 400 })
  }

  let workshop: any
  try {
    workshop = await prisma.workshop.findUnique({ where: { id: workshopId } })
  } catch {
    return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
  }

  if (!workshop) {
    return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const isMockMode = !stripeKey || stripeKey.startsWith('sk_test_placeholder') || stripeKey === 'sk_test_...'

  if (isMockMode) {
    const mockUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/booking/success?workshopId=${workshopId}&mock=true`
    return NextResponse.json({ url: mockUrl })
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey!, { apiVersion: '2025-03-31.basil' })

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: workshop.title,
              description: `${workshop.city} — ${new Date(workshop.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
            },
            unit_amount: workshop.priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        workshopId: workshop.id,
        userId: session.user.id,
      },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/booking/cancel?workshopId=${workshopId}`,
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 })
  }
}
