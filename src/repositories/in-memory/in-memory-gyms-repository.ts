import { randomUUID } from 'node:crypto'
import type { CreateGymDTO } from '@/dtos/gyms/create-gym.dto.js'
import type { Gym } from '@/dtos/gyms/gym.js'
import type { GymsRepository } from '../gyms-repository.js'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: CreateGymDTO): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
