export interface CreateUserDTO {
  id?: string
  name: string
  email: string
  image_url?: string
  password_hash: string
  created_at?: Date | string
}
