import type { UserCreateInput } from '@/generated/prisma/models.js'
import { prisma } from '@/lib/prisma.js'

export class PrismaUserRepository {
  async create(data: UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
}
