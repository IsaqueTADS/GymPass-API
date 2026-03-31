import type { Readable } from 'node:stream'
import type { Gym } from '@/dtos/gyms/gym.js'
import type { UploadGateway } from '@/gateways/upload-gateway.js'
import type { GymsRepository } from '@/repositories/gyms-repository.js'
import { createGympassFileName } from '@/utils/create-gympass-file-name.js'
import { FailedUploadError } from './errors/failed-upload-error.js'
import { InvalidFileTypeError } from './errors/Invalid-file-type-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface UploadDataDTO {
  file: Readable
  filename: string
  mimetype: string
  encoding: string
}

interface UploadImageGymUseCaseRequest {
  gymId: string
  data: UploadDataDTO
}

interface UploadImageGymUseCaseResponse {
  gym: Gym
  publicId: string
}

export class UploadImageGymUseCase {
  constructor(
    private gymsRepository: GymsRepository,
    private uploadGataway: UploadGateway,
  ) {}

  async execute({
    gymId,
    data,
  }: UploadImageGymUseCaseRequest): Promise<UploadImageGymUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']

    if (!allowedMimeTypes.includes(data.mimetype)) {
      throw new InvalidFileTypeError()
    }

    try {
      const newFileName = createGympassFileName(gymId)

      const { url, public_id } = await this.uploadGataway.sendUploadFile(
        data,
        newFileName,
      )

      const gym = await this.gymsRepository.uploadImage(gymId, url)

      return { gym, publicId: public_id ?? '' }
    } catch {
      throw new FailedUploadError()
    }
  }
}
