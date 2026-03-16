import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { AuthenticateUseCase } from '../authenticate-usecase.js'

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUserRepository()
  const authenticateUseCase = new AuthenticateUseCase(userRepository)

  return authenticateUseCase
}
