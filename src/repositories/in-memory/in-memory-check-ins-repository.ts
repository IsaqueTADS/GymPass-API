import { randomUUID } from 'node:crypto'
import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CreateCheckInDTO } from '@/dtos/checkin/create-checkin.dto.js'
import type { CheckInsRepository } from '../check-ins-repository.js'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public chekIns: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = this.chekIns.find((item) => item.user_id === userId)

    if (!checkIn) return null

    return checkIn
  }

  async create(data: CreateCheckInDTO): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
    }

    this.chekIns.push(checkIn)

    return checkIn
  }
}
