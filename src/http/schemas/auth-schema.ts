import z from 'zod'

export const User = z.object({
  id: z.uuid(),
  name: z.string(),
  image_url: z.string().nullable(),
  email: z.email(),
  created_at: z.date(),
})

export const UserResponseSchema = z.object({
  user: User,
})

export const RegisterBodySchema = z.object({
  name: z.string().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter no minimo 6 caracteres'),
})
export const AuthenticateBodySchema = z.object({
  email: z.email('Email inválido'),
  password: z.string(),
})
