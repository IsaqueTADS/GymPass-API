import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/runtime'

import { prisma } from '@/lib/prisma.js'

function generateDatabaseURL(schema: string) {

  if(!process.env.DATABASE_URL){
    throw new Error("A variavel DABASE_URL precisa está definada em .env")
  }



  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default (<Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',

  async setup() {
    // custom setup
    const schema = randomUUID()
    const databaseUrl = generateDatabaseURL(schema)

    console.log(databaseUrl)

    process.env.DATABASE_URL = databaseUrl

    execSync('npm run db:migrate:deploy')

    return {
      async teardown() {
        // called after all tests with this env have been run
        await prisma.$executeRawUnsafe(`
          DROP SCHEMA IF EXISTS "${schema}"
        `)

        await prisma.$disconnect()
      },
    }
  },
})
