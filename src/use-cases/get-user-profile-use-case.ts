import type { User } from '@/dtos/user/user.js'
import type { usersRepository } from '@/repositories/users-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface GetUserProfileUseCaseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: usersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseCaseRequest): Promise<GetUserProfileUseCaseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
