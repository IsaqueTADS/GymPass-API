export interface CreateGymDTO {
  id?: string
  title: string
  description?: string | null
  phone: string | null
  latitude: number
  longitude: number
}
