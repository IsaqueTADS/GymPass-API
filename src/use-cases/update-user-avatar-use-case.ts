import type { Readable } from 'node:stream'
import type { User } from '@/dtos/user/user.js'
import type { UploadGateway } from '@/gateways/upload-gateway.js'
import type { usersRepository } from '@/repositories/users-repository.js'
import { FailedUploadError } from './errors/failed-upload-error.js'
import { InvalidFileTypeError } from './errors/Invalid-file-type-error.js'

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
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']

    if (!allowedMimeTypes.includes(data.mimetype)) {
      throw new InvalidFileTypeError()
    }

    try {
      const { url, public_id } = await this.uploadGataway.sendUploadFile(data)
      const user = await this.userRepository.updateAvatar(userId, url)

      return { user, publicId: public_id ?? '' }
    } catch (err) {
      console.log(err)
      throw new FailedUploadError()
    }
  }
}
