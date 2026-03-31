import { randomUUID } from 'node:crypto'
import type { GympassFileName } from '@/gateways/upload-gateway.js'

export function createGympassFileName(id: string): GympassFileName {
  const currentDate = new Date()
  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()

  const formatDate = `${day}-${month}-${year}`

  const name = `gympass-${id}--${randomUUID()}-${formatDate}`

  console.log(name)
  return name as GympassFileName
}
