import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history-use-case.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch user check ins historyr', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(inMemoryCheckInsRepository)
  })
  it('Deve ser possivel obter o seu histórico de check-ins', async () => {
    const userId = randomUUID()

    inMemoryCheckInsRepository.create({
      user_id: userId,
      gym_id: 'gym-1',
    })
    inMemoryCheckInsRepository.create({
      user_id: userId,
      gym_id: 'gym-2',
    })

    const { checkIns } = await sut.execute({ userId })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ])
  })
})
