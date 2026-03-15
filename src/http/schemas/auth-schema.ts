import z from 'zod'

export const RegisterBodySchema = z.object({
  name: z.string().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter no minimo 6 caracteres'),
})
