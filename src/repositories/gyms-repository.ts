import type { Gym } from '@/dtos/gyms/gym.js'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
}
