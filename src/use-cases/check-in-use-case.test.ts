import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { CheckInUseCase } from './check-in-use-case.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possivel criar um chekin', async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.created_at).toBeInstanceOf(Date)
  })
  it('O usuário não pode fazer 2 check-ins no mesmo dia', async () => {
    const date = new Date(2026, 1, 1, 14)
    vi.setSystemTime(date)

    const userId = 'userid1234'

    const { checkIn } = await sut.execute({
      userId,
      gymId: randomUUID(),
    })

    await expect(() =>
      sut.execute({
        userId,
        gymId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  it('O usuário  pode fazer 2 ou mais check-ins emd ias diferentes', async () => {
    vi.setSystemTime(new Date(2026, 1, 1, 14, 0, 0))

    const userId = 'userid1234'

    await sut.execute({
      userId,
      gymId: randomUUID(),
    })

    vi.setSystemTime(new Date(2026, 1, 1, 14, 0, 0))

    const { checkIn } = await sut.execute({
      userId,
      gymId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
