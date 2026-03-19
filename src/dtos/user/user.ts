export interface User {
  id: string
  name: string
  email: string
  image_url: string | null
  password_hash: string
  created_at: Date
}
