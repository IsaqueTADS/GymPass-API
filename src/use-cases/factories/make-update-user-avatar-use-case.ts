
import { InMemoryUploadGateway } from '@/gateways/in-memory/in-memory-upload-gateway.js'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { UpadateUserAvatarUseCase } from '../update-user-avatar-use-case.js'

export function makeUpdateUserAvatar() {
  const userRepository = new PrismaUserRepository()
  const uploadGataway = new InMemoryUploadGateway()

  const updateUserAvatar = new UpadateUserAvatarUseCase(
    userRepository,
    uploadGataway,
  )

  return updateUserAvatar
}
