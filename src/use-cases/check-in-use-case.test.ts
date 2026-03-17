import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { CheckInUseCase } from './check-in-use-case.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository)
  })

  it('Deve ser possivel criar um chekin', async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    })

    console.log(checkIn)

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.created_at).toBeInstanceOf(Date)
  })

})
