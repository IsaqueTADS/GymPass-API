import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { FetchNearByGymsUseCase } from './fetch-nearby-gyms-use-case.js'

let gymRepository: InMemoryGymsRepository

let sut: FetchNearByGymsUseCase

describe('Fetch nearby gyms use case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new FetchNearByGymsUseCase(gymRepository)
  })

  it('Deve ser possivel o usuário buscar academias próximas (10km) ', async () => {
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
    await gymRepository.create({
      title: 'Tropa de elite da progamação',
      description: '',
      phone: '',
      longitude: -5.8495227,
      latitude: -70.0612613,
    })

    const { gyms } = await sut.execute({
      userLatitude: -42.0612613,
      userLongitude: -16.8495227,
    })

    expect(gyms).toHaveLength(2)
  })

  it('Não deve  ser possivel o usuário buscar academias com mais de 10km ', async () => {
    await gymRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.0612613,
    })
    await gymRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.1612613,
    })

    const { gyms } = await sut.execute({
      userLatitude: -42.0612613,
      userLongitude: -16.8495227,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
