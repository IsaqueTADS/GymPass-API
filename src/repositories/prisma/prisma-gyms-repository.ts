import { Decimal } from '@prisma/client/runtime/client'
import type { CreateGymDTO } from '@/dtos/gyms/create-gym.dto.js'
import type { Gym } from '@/dtos/gyms/gym.js'
import type { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '@/lib/prisma.js'
import type {
  FindManyGymsNearByParams,
  GymsRepository,
} from '../gyms-repository.js'

export class PrismaGymsRepository implements GymsRepository {
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms.map((gym) => this.mapToGym(gym))
  }

  async findManyGymsNearBy({ latitude, longitude }: FindManyGymsNearByParams) {
    const latitudeDecimal = new Decimal(latitude)
    const longitudeDecimal = new Decimal(longitude)
    
    const gyms = await prisma.$queryRaw<Prisma.GymModel[]>`
    SELECT * FROM gyms
    WHERE ( 6371 * acos( cos( radians(${latitudeDecimal}) ) * cos( radians( latitude ) ) 
    * cos( radians( longitude ) - radians(${longitudeDecimal}) ) + sin( radians(${latitudeDecimal}) )
    * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms.map((gym) => this.mapToGym(gym))
  }

  async findById(id: string) {
    const gym = await prisma.gym.findFirst({
      where: {
        id,
      },
    })

    if (!gym) {
      return null
    }

    return this.mapToGym(gym)
  }

  async create(data: CreateGymDTO) {
    const gym = await prisma.gym.create({ data })

    return this.mapToGym(gym)
  }

  private mapToGym(gym: Prisma.GymModel): Gym {
    return {
      id: gym.id,
      title: gym.title,
      description: gym.description,
      phone: gym.phone,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }
  }
}
