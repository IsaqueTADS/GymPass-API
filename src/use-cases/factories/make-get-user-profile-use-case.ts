import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { GetUserProfileUseCase } from '../get-user-profile-use-case.js'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUserRepository()
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)

  return getUserProfileUseCase
}
