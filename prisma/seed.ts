import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🍪 Seeding AIssembly database...')

  // Admin user
  const adminPassword = await bcrypt.hash('AdminPass123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aissembly.com' },
    update: {},
    create: {
      email: 'admin@aissembly.com',
      password: adminPassword,
      name: 'AIssembly Admin',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Demo attendee
  const attendeePassword = await bcrypt.hash('DemoPass123!', 12)
  const attendee = await prisma.user.upsert({
    where: { email: 'demo@aissembly.com' },
    update: {},
    create: {
      email: 'demo@aissembly.com',
      password: attendeePassword,
      name: 'Demo Attendee',
      role: 'ATTENDEE',
      profession: 'Accounting',
      city: 'Nashville',
    },
  })
  console.log('✅ Demo attendee created:', attendee.email)

  // Workshops
  const workshops = [
    {
      title: 'AI Prompting for Accountants: From Basics to Billing',
      profession: 'Accounting',
      city: 'Nashville',
      venueName: 'The Workshop Collective',
      venueAddress: '201 4th Ave N, Nashville, TN 37219',
      date: new Date('2026-05-15'),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      capacity: 20,
      priceCents: 29900,
      description: `Transform how you work with AI in this hands-on, full-day workshop designed specifically for accounting professionals.\n\nYou'll leave with a personal prompt library, practical workflows for your daily tasks, and the confidence to use AI tools like ChatGPT and Copilot in your practice — no tech background required.\n\nThis isn't a theory class. By 5pm, you'll have used AI to draft a client email, summarize a 40-page report, create a reconciliation checklist, and more.`,
      curriculumOutline: `Morning Session:\n• AI fundamentals for accountants (no jargon, just what matters)\n• Your first 10 prompts: client emails, report summaries, meeting prep\n• Live demo: AI-assisted bank reconciliation review\n\nAfternoon Session:\n• Prompt engineering deep-dive\n• Automating routine communications\n• Building your personal accounting prompt library\n• Q&A and wrap-up`,
      facilitatorName: 'Sarah Chen, CPA',
      facilitatorBio: 'Former Big 4 auditor turned AI education specialist. Sarah has trained 300+ accounting professionals and speaks at industry conferences nationwide.',
      status: 'PUBLISHED' as const,
    },
    {
      title: 'AI for HR Managers: Hire Smarter, Not Harder',
      profession: 'HR',
      city: 'Chicago',
      venueName: 'River North Conference Center',
      venueAddress: '444 N Michigan Ave, Chicago, IL 60611',
      date: new Date('2026-05-22'),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      capacity: 18,
      priceCents: 29900,
      description: `Designed for HR managers and talent professionals, this workshop tackles the real challenges you face: sourcing candidates, writing job descriptions, conducting fair interviews, and managing compliance communications.\n\nWalk away with an AI toolkit that makes your HR practice 10x more efficient — and more human, not less.`,
      curriculumOutline: `Morning Session:\n• AI overview for HR professionals\n• Writing irresistible job descriptions in minutes\n• Candidate screening: what AI can (and can't) do ethically\n• Live workshop: rewrite 3 real job postings together\n\nAfternoon Session:\n• Onboarding document automation\n• Policy and compliance writing with AI\n• Difficult conversations: how AI helps you prepare\n• Building your HR prompt library`,
      facilitatorName: 'Marcus Williams',
      facilitatorBio: 'Marcus spent 15 years in HR leadership at Fortune 500 companies before founding his AI consulting practice. He\'s helped dozens of HR teams cut admin time by 40%.',
      status: 'PUBLISHED' as const,
    },
    {
      title: 'AI Marketing Mastery: Content, Copy & Campaigns',
      profession: 'Marketing',
      city: 'Atlanta',
      venueName: 'Ponce City Market Event Space',
      venueAddress: '675 Ponce De Leon Ave NE, Atlanta, GA 30308',
      date: new Date('2026-06-05'),
      startTime: '9:30 AM',
      endTime: '5:30 PM',
      capacity: 24,
      priceCents: 34900,
      description: `The marketing workshop that finally cuts through the AI hype.\n\nYou'll spend the day creating — actual campaigns, real social posts, genuine email sequences — all with AI as your creative co-pilot. Walk away with a month's worth of content ideas and the skills to keep generating more.`,
      curriculumOutline: `Morning Session:\n• AI content creation fundamentals\n• Social media: 30 posts in 30 minutes (seriously)\n• Email campaigns: from brief to send-ready\n• Brand voice: teaching AI to sound like you\n\nAfternoon Session:\n• Campaign briefs and ad copy\n• SEO content strategies with AI\n• Analytics interpretation with AI tools\n• Building your marketing content engine`,
      facilitatorName: 'Jennifer Park',
      facilitatorBio: 'Jennifer is a former agency creative director who now helps marketing teams build AI-powered content operations. Her clients include regional brands and national retail chains.',
      status: 'PUBLISHED' as const,
    },
    {
      title: 'AI Prompting for Accountants: Advanced Workflows',
      profession: 'Accounting',
      city: 'Chicago',
      venueName: 'Loop Business Hub',
      venueAddress: '33 S State St, Chicago, IL 60603',
      date: new Date('2026-06-12'),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      capacity: 16,
      priceCents: 34900,
      description: `For accountants who've completed the foundations workshop or already have AI experience. This advanced session dives into complex workflow automation, multi-step prompting chains, and building systems your whole team can use.\n\nIncludes hands-on work with Excel/Sheets AI integration, advanced financial report summarization, and client communication templates.`,
      curriculumOutline: `Morning Session:\n• Advanced prompt chaining techniques\n• Excel and Google Sheets AI integration deep-dive\n• Automated financial narrative writing\n• Complex reconciliation workflows\n\nAfternoon Session:\n• Building team prompt libraries\n• Multi-document analysis techniques\n• AI-assisted tax season preparation\n• Custom GPT creation for your practice`,
      facilitatorName: 'Sarah Chen, CPA',
      facilitatorBio: 'Former Big 4 auditor turned AI education specialist.',
      status: 'PUBLISHED' as const,
    },
    {
      title: 'AI for Estate Agents: List, Market & Close Faster',
      profession: 'Estate Agent',
      city: 'Nashville',
      venueName: 'Nashville Business Center',
      venueAddress: '150 4th Ave N, Nashville, TN 37219',
      date: new Date('2026-06-19'),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      capacity: 20,
      priceCents: 29900,
      description: `Real estate moves fast. AI moves faster.\n\nIn this workshop for estate agents, you'll learn to write compelling property listings in minutes, craft lead response emails that convert, analyze neighborhood data instantly, and market properties across channels with AI-assisted content creation.`,
      curriculumOutline: `Morning Session:\n• AI for property listing copy (from basic to brilliant)\n• Lead nurture sequences: first contact to contract\n• Market analysis summaries using AI tools\n• Social media content for property promotion\n\nAfternoon Session:\n• Client communication workflows\n• Offer letter and negotiation prep\n• Building a referral nurture system\n• Your personal real estate AI toolkit`,
      facilitatorName: 'David Torres',
      facilitatorBio: 'A top-producing realtor for 12 years, David discovered AI tools while closing 40+ deals a year as a solo agent. He now teaches other agents to work smarter.',
      status: 'PUBLISHED' as const,
    },
    {
      title: 'HR AI Bootcamp: From Hiring to Offboarding',
      profession: 'HR',
      city: 'Atlanta',
      venueName: 'Buckhead Conference & Event Center',
      venueAddress: '3384 Peachtree Rd NE, Atlanta, GA 30326',
      date: new Date('2026-07-10'),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      capacity: 20,
      priceCents: 29900,
      description: `A comprehensive AI workshop covering the full employee lifecycle — from sourcing and hiring through onboarding, development, and offboarding. Perfect for HR generalists who manage multiple people processes.\n\nYou'll build templates, workflows, and prompts for every stage of the employee journey.`,
      curriculumOutline: `Morning Session:\n• Job posting and sourcing with AI\n• Interview question generation and rubric creation\n• Offer letter and contract templates\n• AI-assisted background check communications\n\nAfternoon Session:\n• Onboarding plan creation\n• Performance review frameworks\n• Difficult conversation preparation\n• Offboarding checklists and communications\n• Compliance documentation workflows`,
      facilitatorName: 'Lisa Nakamura',
      facilitatorBio: 'SHRM-certified HR professional with expertise in AI implementation for people teams. Lisa has helped 50+ companies modernize their HR processes.',
      status: 'PUBLISHED' as const,
    },
  ]

  for (const workshop of workshops) {
    const existing = await prisma.workshop.findFirst({
      where: { title: workshop.title, city: workshop.city },
    })
    if (!existing) {
      await prisma.workshop.create({ data: workshop })
      console.log(`✅ Workshop created: ${workshop.title} (${workshop.city})`)
    } else {
      console.log(`⏭️ Workshop already exists: ${workshop.title}`)
    }
  }

  console.log('\n🎉 Seed complete!')
  console.log('Admin login: admin@aissembly.com / AdminPass123!')
  console.log('Demo login: demo@aissembly.com / DemoPass123!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
