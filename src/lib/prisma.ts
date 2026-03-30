import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env/index.js'
import { PrismaClient } from '../generated/prisma/client.js'

let prismaInstance: PrismaClient | undefined

export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || env.DATABASE_URL
  console.log('[Prisma] Creating client with URL:', connectionString)
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
  })
}

export function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient()
  }
  return prismaInstance
}

export async function resetPrismaClient() {
  if (prismaInstance) {
    await prismaInstance.$disconnect()
  }
  prismaInstance = createPrismaClient()
  return prismaInstance
}

export const prisma = {
  get user() {
    return getPrismaClient().user
  },
  get gym() {
    return getPrismaClient().gym
  },
  get checkIn() {
    return getPrismaClient().checkIn
  },
  get $connect() {
    return getPrismaClient().$connect
  },
  get $disconnect() {
    return getPrismaClient().$disconnect
  },
  get $executeRaw() {
    return getPrismaClient().$executeRaw
  },
  get $executeRawUnsafe() {
    return getPrismaClient().$executeRawUnsafe
  },
  get $queryRaw() {
    return getPrismaClient().$queryRaw
  },
  get $queryRawUnsafe() {
    return getPrismaClient().$queryRawUnsafe
  },
  get $transaction() {
    return getPrismaClient().$transaction
  },
  get $on() {
    return getPrismaClient().$on
  },
}
