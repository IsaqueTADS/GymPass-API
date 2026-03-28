import { randomUUID } from 'node:crypto'
import type { CreateUserDTO } from '@/dtos/user/create-user.dto.js'
import type { User } from '@/dtos/user/user.js'
import type { usersRepository } from '../users-repository.js'

export class InMemoryUsersRepository implements usersRepository {
  public items: User[] = []

  async updateAvatar(id: string, imageUrl: string): Promise<User> {
    const userIndex = this.items.findIndex((item) => item.id === id)

    const user = this.items[userIndex]

    const updatedUser = {
      ...user,
      image_url: imageUrl,
    }

    this.items[userIndex] = updatedUser

    return updatedUser
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }

    return user
  }
  async create(data: CreateUserDTO) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      image_url: null,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
