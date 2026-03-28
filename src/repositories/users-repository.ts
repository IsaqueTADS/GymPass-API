import type { CreateUserDTO } from '@/dtos/user/create-user.dto.js'
import type { User } from '@/dtos/user/user.js'

export interface usersRepository {
  updateAvatar(id: string, imageUrl: string): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
}
