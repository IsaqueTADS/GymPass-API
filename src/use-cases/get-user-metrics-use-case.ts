import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

type GetUserMetricsUseCaseResponse = {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
