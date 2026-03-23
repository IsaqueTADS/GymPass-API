import type { Readable } from 'node:stream'
import type { User } from '@/dtos/user/user.js'
import type { UploadGateway } from '@/gateways/upload-gateway.js'
import type { usersRepository } from '@/repositories/users-repository.js'

interface UploadDataDTO {
  file: Readable
  filename: string
  mimetype: string
  encoding: string
}

interface UpadteUserAvatarUseCaseRequest {
  userId: string
  data: UploadDataDTO
}

interface UpadteUserAvatarUseCaseResponse {
  user: User
  publicId: string
}

export class UpadateUserAvatarUseCase {
  constructor(
    private userRepository: usersRepository,
    private uploadGataway: UploadGateway,
  ) {}

  async execute({
    userId,
    data,
  }: UpadteUserAvatarUseCaseRequest): Promise<UpadteUserAvatarUseCaseResponse> {
    try {
      const { url, public_id } = await this.uploadGataway.sendUploadFile(data)
      const user = await this.userRepository.updateAvatar(userId, url)
      return { user, publicId: public_id ?? '' }
    } catch {
      throw Error('')
    }
  }
}
