import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { LateValidationCheckInsError } from './errors/late-validation-check-ins-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { ValidateCheckInUseCase } from './validate-check-in-use-case.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate check in use case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(inMemoryCheckInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possivel o usuário validar check-in de um usuário', async () => {
    const userId = randomUUID()

    vi.setSystemTime(new Date(2026, 1, 1, 14, 0, 0))
    const data = new Date()

    const userCheckIn = await inMemoryCheckInsRepository.create({
      user_id: userId,
      gym_id: 'gym-1',
    })

    const { checkIn } = await sut.execute({
      checkId: userCheckIn.id,
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.validated_at).toEqual(data)
    expect(inMemoryCheckInsRepository.chekIns[0].validated_at).toEqual(data)
  })

  it('Não deve ser possivel o usuário validar check-in inexistente', async () => {
    await expect(() =>
      sut.execute({
        checkId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it(' O check-in só pode ser validado até 20 minutos após criado', async () => {
    vi.setSystemTime(new Date(2026, 1, 1, 14, 40))
    const userId = randomUUID()

    const userCheckIn = await inMemoryCheckInsRepository.create({
      user_id: userId,
      gym_id: 'gym-1',
    })

    const advanceTimer = 1000 * 60 * 21 //21minutes

    vi.advanceTimersByTime(advanceTimer)

    await expect(() =>
      sut.execute({
        checkId: userCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateValidationCheckInsError)
  })
})
