import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { RegisterBodySchema } from '@/schema/auth-schema.js'
import { resgister } from './controllers/register-controller.js'

export const appRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'POST',
    url: '/users',
    schema: {
      tags: ['Auth'],
      summary: 'register user',
      body: RegisterBodySchema,
    },
    handler: resgister,
  })
}
