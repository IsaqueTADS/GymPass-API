import dayjs from 'dayjs'
import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CreateCheckInDTO } from '@/dtos/checkin/create-checkin.dto.js'
import { prisma } from '@/lib/prisma.js'
import type { CheckInsRepository } from '../check-ins-repository.js'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CreateCheckInDTO) {
    const checkIn = await prisma.checkIn.create({ data })

    return checkIn
  }
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toISOString(), // or toDate()
          lte: endOfTheDay.toISOString(),
        },
      },
    })

    return checkIn
  }
  async findManyByUserId(userId: string, page: number) {
    const allCheckInsOfUser = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return allCheckInsOfUser
  }
  async countByUserId(userId: string) {
    const countCheckIns = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return countCheckIns
  }
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }
  async save(checkIn: CheckIn) {
    const saveCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    })

    return saveCheckIn
  }
}
