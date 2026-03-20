import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { Gym } from '@/dtos/gyms/gym.js'
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js'

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
}

type FetchUserCheckInsHistoryUseCaseResponse = {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)

    return { checkIns }
  }
}
