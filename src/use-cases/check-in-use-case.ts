import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import type { GymsRepository } from '@/repositories/gyms-repository.js'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude,
        longitude: gym.longitude,
      },
    )

    const MAX_DISTANCE_IN_KM = 0.1  

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new Error()
    }

    const isCheckInDateConflict =
      await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

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
