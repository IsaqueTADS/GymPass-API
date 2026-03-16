import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { RegisterUseCase } from '../register-use-case.js'

export function makeRegisterUseCase() {
  const userRepository = new PrismaUserRepository()
  const registerUseCase = new RegisterUseCase(userRepository)

  return registerUseCase
}
