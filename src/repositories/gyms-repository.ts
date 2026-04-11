import type { CreateGymDTO } from '@/dtos/gyms/create-gym.dto.js'
import type { Gym } from '@/dtos/gyms/gym.js'

export interface FindManyGymsNearByParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  uploadImage(gymId: string, imageUrl: string): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyGymsNearBy(params: FindManyGymsNearByParams): Promise<Gym[]>
  findById(id: string): Promise<Gym | null>
  create(data: CreateGymDTO): Promise<Gym>
}
