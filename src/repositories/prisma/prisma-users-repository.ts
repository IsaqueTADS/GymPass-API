import type { CreateUserDTO } from '@/dtos/user/create-user.dto.js'
import type { User } from '@/dtos/user/user.js'
import { prisma } from '@/lib/prisma.js'
import type { usersRepository } from '../users-repository.js'

export class PrismaUserRepository implements usersRepository {
  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
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
