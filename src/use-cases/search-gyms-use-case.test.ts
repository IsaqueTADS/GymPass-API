import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { SearchGymsUseCase } from './search-gyms-use-case.js'

let gymRepository: InMemoryGymsRepository

let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymRepository)
  })

  it('Deve ser possivel pesquisar academia', async () => {
    await gymRepository.create({
      title: 'Os marambosos progamers',
      description: '',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.0612613,
    })
    await gymRepository.create({
      title: 'Tropa de elite da progamação',
      description: '',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.0612613,
    })

    const { gyms } = await sut.execute({
      query: 'Tropa de elite da progamação',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Tropa de elite da progamação' }),
    ])
  })
  it('Deve ser possivel obter busca paginada das gyms', async () => {
    // const userId = randomUUID()

    for (let i = 1; i <= 25; i++) {
      await gymRepository.create({
        title: `gym-${i}`,
        description: '',
        phone: '',
        longitude: -16.8495227,
        latitude: -42.0612613,
      })
    }

    const { gyms } = await sut.execute({ query: 'gym', page: 2 })

    expect(gyms).toHaveLength(5)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' }),
      expect.objectContaining({ title: 'gym-23' }),
      expect.objectContaining({ title: 'gym-24' }),
      expect.objectContaining({ title: 'gym-25' }),
    ])
  })
})
