import { hash } from 'argon2'
import type { usersRepository } from '@/repositories/users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exist-error.js'

interface User {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: Date
}
interface InputDTO {
  name: string
  email: string
  password: string
}
interface OutputDTO {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: usersRepository) {}

  async execute({ name, email, password }: InputDTO): Promise<OutputDTO> {
    const password_hash = await hash(password)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
