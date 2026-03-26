import z from 'zod'

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

export const GymsResponseSchema = z.object({
  gym: z.object({
    id: z.uuid(),
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  }),
})
