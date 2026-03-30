import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/runtime'
import { prisma } from '@/lib/prisma.js'

async function truncateTables() {
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE users CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE gyms CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE check_ins CASCADE')
  } catch {
    // Tabelas podem não existir ainda
  }
}

export default (<Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',

  async setup() {
    try {
      await truncateTables()
    } catch {
      execSync('npm run db:migrate:deploy', {
        stdio: 'inherit',
        env: { ...process.env },
      })
    }

    return {
      async teardown() {
        await truncateTables()
      },
    }
  },
})
