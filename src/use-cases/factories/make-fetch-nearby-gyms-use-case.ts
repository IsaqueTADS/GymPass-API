import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { FetchNearByGymsUseCase } from '../fetch-nearby-gyms-use-case.js'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsUseCase = new FetchNearByGymsUseCase(gymsRepository)

  return fetchNearbyGymsUseCase
}
