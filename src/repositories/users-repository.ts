import type { CreateUserDTO } from '@/dtos/user/create-user.dto.js'
import type { User } from '@/dtos/user/user.js'

export interface usersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
}
