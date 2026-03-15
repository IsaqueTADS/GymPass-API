import { verify } from 'argon2'
import type { User } from '@/dtos/user/user.js'
import type { usersRepository } from '@/repositories/users-repository.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: usersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatch = await verify(user.password_hash, password)

    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
