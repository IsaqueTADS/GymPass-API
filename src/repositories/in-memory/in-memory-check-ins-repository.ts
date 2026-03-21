import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CreateCheckInDTO } from '@/dtos/checkin/create-checkin.dto.js'
import type { CheckInsRepository } from '../check-ins-repository.js'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public chekIns: CheckIn[] = []

 async countByUserId(userId: string): Promise<number> {
    return this.chekIns.filter((checkIn) => checkIn.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.chekIns.filter(
      (checkIn) => checkIn.user_id === userId,
    )

    return checkIns.slice((page - 1) * 20, page * 20)
    // 1 =  0  a 20
    // 2 =  20 a 40
    // 3 =  40 a 60
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = this.chekIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameData =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameData
    })

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
