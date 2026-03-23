import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { SearchGymsUseCase } from '../search-gyms-use-case.js'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository)

  return searchGymsUseCase
}
