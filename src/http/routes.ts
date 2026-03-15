import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { RegisterBodySchema } from '@/http/schemas/auth-schema.js'
import { resgisterController } from './controllers/register-controller.js'
import { errorSchema } from './schemas/error-schema.js'
import { ValidationErrorSchema } from './schemas/validation-error-schema.js'

export const appRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'POST',
    url: '/users',
    schema: {
      tags: ['Auth'],
      summary: 'register user',
      body: RegisterBodySchema,
      response: {
        201: z.null(),
        400: ValidationErrorSchema,
        409: errorSchema,
      },
    },
    handler: resgisterController,
  })
}
