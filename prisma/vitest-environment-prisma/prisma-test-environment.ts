import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/runtime'
import { prisma } from '@/lib/prisma.js'

export default (<Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',

  async setup() {
    execSync('npm run db:migrate:deploy')
    return {
      async teardown() {
        await prisma.$executeRawUnsafe('DELETE FROM users')
        await prisma.$executeRawUnsafe('DELETE FROM gyms')
        await prisma.$executeRawUnsafe('DELETE FROM check_ins')
      },
    }
  },
})
