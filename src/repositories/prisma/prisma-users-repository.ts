import type { CreateUserDTO } from '@/dtos/user/create-user.dto.js'

import { prisma } from '@/lib/prisma.js'
import type { usersRepository } from '../users-repository.js'

export class PrismaUserRepository implements usersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    return user
  }
  async create(data: CreateUserDTO) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
}
