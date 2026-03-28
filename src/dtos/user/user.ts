export type Role = 'ADMIN' | 'MEMBER'

export interface User {
  id: string
  name: string
  email: string
  image_url: string | null
  role: Role
  password_hash: string
  created_at: Date
}
