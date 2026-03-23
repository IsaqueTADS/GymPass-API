import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history-use-case.js'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return fetchUserCheckInsHistoryUseCase
}
