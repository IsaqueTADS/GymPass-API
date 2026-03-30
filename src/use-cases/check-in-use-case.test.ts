import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CheckInUseCase } from './check-in-use-case.js'
import { MaxDistanceError } from './errors/max-distance-error.js'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.js'

let gymsRepository: InMemoryGymsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'Progamador da shoope',
      description: 'vazio',
      phone: '',
      longitude: 0,
      latitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possivel criar um chekin', async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.created_at).toBeInstanceOf(Date)
  })
  it('O usuário não pode fazer 2 check-ins no mesmo dia', async () => {
    const date = new Date(2026, 1, 1, 14)
    vi.setSystemTime(date)

    const userId = 'userid1234'

    await sut.execute({
      userId,
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        userId,
        gymId: 'gym-1',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('O usuário  pode fazer 2 ou mais check-ins em dias diferentes', async () => {
    vi.setSystemTime(new Date(2026, 1, 1, 14, 0, 0))

    const userId = 'userid1234'

    await sut.execute({
      userId,
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2026, 1, 2, 14, 0, 0))

    const { checkIn } = await sut.execute({
      userId,
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('O usuáriuo não pode fazer check-in se não estiver perto da academia', async () => {
    gymsRepository.create({
      id: 'gym-2',
      title: 'Progamador da shoope',
      description: 'vazio',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.0612613,
    })

    await expect(() =>
      sut.execute({
        userId: randomUUID(),
        gymId: 'gym-2',
        userLatitude: -16.8313143,
        userLongitude: -42.0511108,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
