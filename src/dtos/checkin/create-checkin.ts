import type { CheckIn } from './checkin.js'

export type CreateCheckin = Omit<CheckIn, 'id' | 'created_at'>
