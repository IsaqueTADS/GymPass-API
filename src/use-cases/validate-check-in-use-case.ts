import dayjs from 'dayjs'
import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import type { GymsRepository } from '@/repositories/gyms-repository.js'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js'
import { LateValidationCheckInsError } from './errors/late-validation-check-ins-error.js'
import { MaxDistanceError } from './errors/max-distance-error.js'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface ValidateCheckInUseCaseRequest {
  checkId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckinInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckinInCreation > 20) {
      throw new LateValidationCheckInsError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
