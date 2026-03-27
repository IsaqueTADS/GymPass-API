import z from 'zod'

export const Gym = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

export const CreateGymsBodySchema = z.object({
  title: z.string().min(3),
  description: z.string().nullable().optional(),
  phone: z.string().nullable(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }, 'Latitude inválida'),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }, 'Longitude inválida'),
})

export const SearchGymsQuerySchema = z.object({
  query: z.string().default(''),
  page: z.coerce.number().min(1).default(1),
})

export const FetchNearbyGymsQuerySchema = z.object({
  userLatitude: z.coerce
    .number()
    .refine((value) => Math.abs(value) <= 90, { message: 'Latitude inválida' }),
  userLongitude: z.coerce.number().refine((value) => Math.abs(value) <= 180, {
    message: 'Longitude inválida',
  }),
})

export const GymsResponseSchema = z.object({
  gym: Gym,
})

export const SearchGymsResponseSchema = z.object({
  gyms: z.array(Gym),
})

export const FetchNearbyGymsResponseSchema = z.object({
  gyms: z.array(Gym),
})
