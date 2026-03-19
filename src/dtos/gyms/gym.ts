import type { Decimal } from '@prisma/client/runtime/library'

export interface Gym {
  id: string
  title: string
  description: string | null
  phone: string | null
  latitude: Decimal
  longitude: Decimal
}
