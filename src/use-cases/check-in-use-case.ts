import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const currentDate = new Date()

    const isCheckInDateConflict =
      await this.checkInsRepository.findByUserIdOnDate(userId, currentDate)

    if (isCheckInDateConflict) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
