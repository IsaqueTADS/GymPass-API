
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CreateGymUseCase } from './create-gym-use-case.js'


let gymRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym use case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('Deve ser possivel cadastrar uma academia', async () => {
    const { gym } = await sut.execute({
      title: 'Os marambosos progamers',
      description: '',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.0612613,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
