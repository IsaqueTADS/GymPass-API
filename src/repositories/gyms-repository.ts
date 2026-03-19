import type { CreateGymDTO } from '@/dtos/gyms/create-gym.dto.js'
import type { Gym } from '@/dtos/gyms/gym.js'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: CreateGymDTO): Promise<Gym>
}
                                                           