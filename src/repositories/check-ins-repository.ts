import type { CheckIn } from '@/dtos/checkin/checkin.js'
import type { CreateCheckInDTO } from '@/dtos/checkin/create-checkin.dto.js'

export interface CheckInsRepository {
  create(data: CreateCheckInDTO): Promise<CheckIn> 
}
