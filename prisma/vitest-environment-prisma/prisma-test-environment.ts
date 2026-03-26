import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import type { Environment } from 'vitest/runtime'
import { PrismaClient } from '@/generated/prisma/client.js'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default (<Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',

  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseUrl
   
    execSync('npm run db:migrate:deploy')

    return {
      async teardown() {
        console.log('[TestEnv] Dropping schema:', schema)
        const cleanupAdapter = new PrismaPg({ connectionString: databaseUrl })
        const cleanupPrisma = new PrismaClient({ adapter: cleanupAdapter })

        await cleanupPrisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await cleanupPrisma.$disconnect()
      },
    }
  },
})
