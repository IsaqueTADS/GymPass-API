import z from 'zod'

export const CheckIn = z.object({
  id: z.uuid(),
  created_at: z.date(),
  validated_at: z.date().nullable(),
  user_id: z.uuid(),
  gym_id: z.uuid(),
})

export const CreateCheckInBodySchema = z.object({
  userLatitude: z.coerce.number().refine((value) => Math.abs(value) <= 90, {
    message: 'Latitude inválida',
  }),
  userLongitude: z.coerce.number().refine((value) => Math.abs(value) <= 180, {
    message: 'Longitude inválida',
  }),
})
export const CreateCheckInParamsSchema = z.object({
  gymId: z.uuid('ID da academia inválido'),
})

export const ValidateCheckInParamsSchema = z.object({
  checkInId: z.string().uuid('ID do check-in inválido'),
})

export const FetchUserCheckInsHistoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

export const GetUserMetricsQuerySchema = z.object({})

export const CheckInResponseSchema = z.object({
  checkIn: CheckIn,
})

export const CheckInsResponseSchema = z.object({
  checkIns: z.array(CheckIn),
})

export const UserMetricsResponseSchema = z.object({
  total: z.number(),
})
