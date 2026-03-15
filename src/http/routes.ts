import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  AuthenticateBodySchema,
  RegisterBodySchema,
} from '@/http/schemas/auth-schema.js'
import { authenticateController } from './controllers/authenticate-controller.js'
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

  app.route({
    method: 'POST',
    url: '/sessions',
    schema: {
      tags: ['Auth'],
      summary: 'authenticate user',
      body: AuthenticateBodySchema,
      response: {
        201: z.null(),
        400: ValidationErrorSchema
      },
    },
    handler: authenticateController,
  })
}
