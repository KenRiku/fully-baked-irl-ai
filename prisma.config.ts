import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrate: {
    adapter: async () => {
      const { neonConfig, Pool } = await import('@neondatabase/serverless')
      neonConfig.webSocketConstructor = require('ws')
      const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
      return new PrismaNeon(pool)
    },
  },
})
