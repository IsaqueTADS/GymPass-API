import type { CheckIn } from '@/generated/prisma/client.js'
import type { usersRepository } from '@/repositories/users-repository.js'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckinUseCaseResponse {
  CheckIn: CheckIn
}

export class CheckinUseCase {
  constructor(private userRepository: usersRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    return
  }
}
