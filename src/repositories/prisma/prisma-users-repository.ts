import type { CreateUserDTO } from '@/dtos/user/create-user.dto.js'
import type { User } from '@/dtos/user/user.js'
import { prisma } from '@/lib/prisma.js'
import type { usersRepository } from '../users-repository.js'

export class PrismaUserRepository implements usersRepository {
  async updateAvatar(id: string, imageUrl: string): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        image_url: imageUrl,
      },
    })

    return user
  }
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
