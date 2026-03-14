import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { resgister } from './controllers/register-controller.js'

export const registerBodySchema = z.object({
  name: z.string().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter no minimo 6 caracteres'),
})

export const appRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'POST',
    url: '/users',
    schema: {
      tags: ['Auth'],
      summary: 'register user',
      body: registerBodySchema,
    },
    handler: resgister,
  })
}
