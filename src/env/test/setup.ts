import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client.js'

const schemaFilePath = join(process.cwd(), 'test-schema.json')

export async function setup() {
  console.log('[E2E Setup] Starting test database setup...')
  const testSchema = `test_${randomUUID().replace(/-/g, '').slice(0, 12)}`

  const baseUrl = 'postgresql://docker:docker@localhost:5432/gympass_test'
  const testDatabaseUrl = `${baseUrl}?schema=${testSchema}`

  const adapter = new PrismaPg({
    connectionString: `${baseUrl}?schema=public`,
  })
  const prisma = new PrismaClient({ adapter })

  await prisma.$executeRawUnsafe(`CREATE SCHEMA "${testSchema}"`)
  await prisma.$disconnect()

  const dir = join(process.cwd(), '.test')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  writeFileSync(
    schemaFilePath,
    JSON.stringify({ schema: testSchema, databaseUrl: testDatabaseUrl }),
  )

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
  })

  return async () => {
    const cleanupAdapter = new PrismaPg({
      connectionString: `${baseUrl}?schema=public`,
    })
    const cleanupPrisma = new PrismaClient({ adapter: cleanupAdapter })

    await cleanupPrisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${testSchema}" CASCADE`,
    )
    await cleanupPrisma.$disconnect()

    try {
      const { unlinkSync } = await import('node:fs')
      unlinkSync(schemaFilePath)
    } catch {
      // ignore
    }
  }
}
