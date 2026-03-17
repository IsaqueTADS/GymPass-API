export interface CreateCheckInDTO {
  id?: string
  created_at?: Date
  validated_at?: Date
  user_id: string
  gym_id: string
}
