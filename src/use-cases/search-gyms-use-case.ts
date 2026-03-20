import type { Gym } from '@/dtos/gyms/gym.js'

import type { GymsRepository } from '@/repositories/gyms-repository.js'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

type SearchGymsUseCaseResponse = {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymRepository.searchMany(query, page)

    return { gyms }
  }
}
