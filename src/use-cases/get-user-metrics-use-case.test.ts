import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'

import { GetUserMetricsUseCase } from './get-user-metrics-use-case.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Fetch user check ins historyr', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(inMemoryCheckInsRepository)
  })
  it('Deve ser possivel obter o número de check-ins realizados pelo usuário logado', async () => {
    const userId = randomUUID()
    const amountCheckins = 10

    for (let i = 1; i <= amountCheckins; i++) {
      inMemoryCheckInsRepository.create({
        user_id: userId,
        gym_id: 'gym-1',
      })
    }

    const { checkInsCount } = await sut.execute({ userId })

    expect(checkInsCount).toEqual(amountCheckins)
  })
})
