import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  phone: z.string().optional(),
  teamSize: z.coerce.number().min(2),
  profession: z.string().min(2),
  preferredDates: z.string().optional(),
  message: z.string().min(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    await prisma.corporateInquiry.create({ data })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err?.errors) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
