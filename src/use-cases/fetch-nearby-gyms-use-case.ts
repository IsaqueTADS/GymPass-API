import type { Gym } from '@/dtos/gyms/gym.js'

import type { GymsRepository } from '@/repositories/gyms-repository.js'

export interface FetchNearByGymsUseCaseRequest {
  userLatitute: number
  userLongitude: number
}

interface FetchNearByGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearByGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    userLatitute,
    userLongitude,
  }: FetchNearByGymsUseCaseRequest): Promise<FetchNearByGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyGymsNearBy({
      latitude: userLatitute,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
