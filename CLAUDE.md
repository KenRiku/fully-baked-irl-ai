@AGENTS.md

# AIssembly — Development Guide

## Project Overview

AIssembly is an IRL AI Workshop Booking platform built with Next.js 14 App Router. It targets non-tech professionals (accountants, HR managers, estate agents, marketers).

## Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:seed      # Seed database with sample data
npx prisma studio    # Open Prisma database browser
npx prisma migrate dev --name <name>  # Create and apply a migration
```

## Architecture

```
src/
  app/
    (public)/        # Public-facing pages (/, /workshops, /corporate)
    (auth)/          # Auth pages (/login, /signup)
    admin/           # Admin dashboard (requires ADMIN role)
    dashboard/       # Attendee dashboard (requires auth)
    api/             # API routes
    booking/         # Booking success/cancel pages
  components/        # Shared components (Navbar)
  lib/
    auth.ts          # NextAuth configuration
    prisma.ts        # Prisma client singleton
prisma/
  schema.prisma      # Database schema
  seed.ts            # Seed script
```

## Auth

- NextAuth v5 beta with JWT strategy
- Two roles: ATTENDEE (default) and ADMIN
- Admin credentials (after seeding): admin@aissembly.com / AdminPass123!
- Middleware protects /dashboard (requires auth) and /admin (requires ADMIN role)

## Payments / Stripe

- Mock mode: no STRIPE_SECRET_KEY set -> redirects directly to /booking/success?workshopId=xxx&mock=true
- Real mode: creates Stripe Checkout session
- /api/checkout -- creates session
- /api/bookings -- creates mock booking
- /api/bookings/confirm -- confirms after real Stripe payment

## Database

Using Prisma 7 with Neon serverless PostgreSQL adapter.

Key models: User, Workshop, Booking, Resource, CorporateInquiry

## Styling Conventions

- Warm cream background: #FDF6EC
- Dark espresso for admin/text: #1A0F0A
- Amber for CTAs: #D47C0F
- Terracotta for accents: #C85A2A
- Headings: Playfair Display (serif)
- Body: DM Sans

## Demo Credentials (after seeding)

- Admin: admin@aissembly.com / AdminPass123!
- Attendee: demo@aissembly.com / DemoPass123!
