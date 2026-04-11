import { UploadClaudinaryGateway } from '@/gateways/claudinary/upload-claudinary-gateway.js'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { UploadImageGymUseCase } from '../upload-image-gym-use-case.js'

export function makeUploadImageGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const uploadGataway = new UploadClaudinaryGateway()

  const uploadImageGymUseCase = new UploadImageGymUseCase(
    gymsRepository,
    uploadGataway,
  )

  return uploadImageGymUseCase
}
