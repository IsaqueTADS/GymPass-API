import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PrismaPg } from '@prisma/adapter-pg'
import type { Environment } from 'vitest/runtime'
import { PrismaClient } from '@/generated/prisma/client.js'
import { resetPrismaClient } from '@/lib/prisma.js'

let testSchema: string
let databaseUrl: string

export default (<Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',

  async setup() {
    testSchema = `test_${randomUUID().replace(/-/g, '').slice(0, 12)}`
    const baseUrl = 'postgresql://docker:docker@localhost:5432/gympass_test'
    databaseUrl = `${baseUrl}?schema=${testSchema}`

    const adapter = new PrismaPg({
      connectionString: `${baseUrl}?schema=public`,
    })
    const prisma = new PrismaClient({ adapter })

    await prisma.$executeRawUnsafe(`CREATE SCHEMA "${testSchema}"`)

    const result = await prisma.$queryRawUnsafe<{ schema_name: string }[]>(`
      SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${testSchema}'
    `)
    console.log('[Setup] Schema created:', result)

    await prisma.$disconnect()

    const dir = join(process.cwd(), '.test')
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    const schemaFilePath = join(process.cwd(), 'test-schema.json')
    writeFileSync(
      schemaFilePath,
      JSON.stringify({ schema: testSchema, databaseUrl }),
    )

    process.env.DATABASE_URL = databaseUrl

    await resetPrismaClient()

    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    })

    return {
      async teardown() {
        const cleanupAdapter = new PrismaPg({
          connectionString: `${baseUrl}?schema=public`,
        })
        const cleanupPrisma = new PrismaClient({ adapter: cleanupAdapter })

        await cleanupPrisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${testSchema}" CASCADE`,
        )
        await cleanupPrisma.$disconnect()

        try {
          const schemaFilePath = join(process.cwd(), 'test-schema.json')
          unlinkSync(schemaFilePath)
        } catch {
          // ignore
        }
      },
    }
  },
})
