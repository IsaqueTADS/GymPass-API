import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  const currentEnv = process.env.NODE_ENV || 'dev'

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found')
  }

  const url = new URL(process.env.DATABASE_URL)
  const schemaFromUrl = url.searchParams.get('schema')

  const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL },
    schemaFromUrl ? { schema: schemaFromUrl } : undefined,
  )

  return new PrismaClient({
    adapter,
    log: currentEnv === 'dev' ? ['query', 'error', 'warn'] : [],
  })
}

let _prisma: PrismaClient | undefined

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const currentEnv = process.env.NODE_ENV || 'dev'

    if (currentEnv === 'test') {
      if (!_prisma) {
        _prisma = createPrismaClient()
      }
    } else {
      if (!_prisma) {
        _prisma = globalForPrisma.prisma || createPrismaClient()
        if (currentEnv === 'dev') {
          globalForPrisma.prisma = _prisma
        }
      }
    }

    return _prisma[prop as keyof PrismaClient]
  },
})
