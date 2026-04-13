# AIssembly — IRL AI Workshops

> Fully Baked: IRL AI — Hands-on AI workshops for non-tech professionals

A Next.js 14 platform for booking and managing in-person AI workshops designed for accountants, HR managers, estate agents, and marketers.

## Features

- **Public Site**: Workshop catalog with filtering by profession and city
- **Workshop Detail**: Full workshop info with Stripe checkout
- **Auth**: JWT-based auth with NextAuth v5 (email/password)
- **Attendee Dashboard**: View upcoming and past bookings
- **Corporate Inquiries**: Request private/team training
- **Admin Panel**: Manage workshops, view attendees, handle inquiries

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Prisma 7
- **Auth**: NextAuth v5 (beta) with JWT strategy
- **Payments**: Stripe Checkout (with mock fallback mode)
- **Styling**: Tailwind CSS v4 + inline styles (warm baked aesthetic)
- **Forms**: React Hook Form + Zod validation

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. Set up your database:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. Run:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon recommended) |
| `AUTH_SECRET` | Random secret for NextAuth (use `openssl rand -base64 32`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXTAUTH_URL` | Base URL (e.g. `http://localhost:3000`) |

## Mock / Demo Mode

If `STRIPE_SECRET_KEY` is not set or starts with `sk_test_placeholder`, the platform operates in mock mode — clicking "Book Now" creates a booking directly without payment.

## Demo Credentials (after seeding)

- **Admin**: `admin@aissembly.com` / `AdminPass123!`
- **Attendee**: `demo@aissembly.com` / `DemoPass123!`

## Admin Routes

- `/admin` — Dashboard with revenue stats
- `/admin/workshops` — Workshop management
- `/admin/workshops/new` — Create workshop
- `/admin/workshops/[id]/edit` — Edit workshop
- `/admin/workshops/[id]/attendees` — View attendee list
- `/admin/inquiries` — Corporate inquiry inbox

## Color Palette

| Name | Hex |
|------|-----|
| Cream | `#FDF6EC` |
| Espresso | `#1A0F0A` |
| Amber | `#D47C0F` |
| Terracotta | `#C85A2A` |
| Warm Gray | `#8B7355` |
| Light Amber | `#F5E6CC` |
