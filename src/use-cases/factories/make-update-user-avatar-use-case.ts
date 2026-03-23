import { UploadClaudinaryGateway } from '@/gateways/claudinary/upload-claudinary-gateway.js'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { UpadateUserAvatarUseCase } from '../update-user-avatar-use-case.js'

export function makeUpdateUserAvatar() {
  const userRepository = new PrismaUserRepository()
  const uploadGataway = new UploadClaudinaryGateway()

  const updateUserAvatar = new UpadateUserAvatarUseCase(
    userRepository,
    uploadGataway,
  )

  return updateUserAvatar
}
