import { randomUUID } from 'node:crypto'
import type { CreateGymDTO } from '@/dtos/gyms/create-gym.dto.js'
import type { Gym } from '@/dtos/gyms/gym.js'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js'
import type {
  FindManyGymsNearByParams,
  GymsRepository,
} from '../gyms-repository.js'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async uploadImage(gymId: string, imageUrl: string): Promise<Gym> {
    const gymIndex = this.items.findIndex((item) => item.id === gymId)

    const gym = this.items[gymIndex]

    const updateGym = {
      ...gym,
      image_url: imageUrl,
    }

    this.items[gymIndex] = updateGym

    return updateGym
  }

  async findManyGymsNearBy(params: FindManyGymsNearByParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      )

      return distance < 10
    })
  }

  async create(data: CreateGymDTO): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      image_url: null,
      description: data.description ?? null,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
    }

    this.items.push(gym)

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
