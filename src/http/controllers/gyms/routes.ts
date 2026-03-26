import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  CreateGymsBodySchema,
  GymsResponseSchema,
} from '@/http/schemas/gyms-schema.js'
import { VerifyJWT } from '../../middlewares/verify-jwt.js'
import { createController } from './create-controller.js'

export const gymsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', VerifyJWT)

  app.route({
    method: 'POST',
    url: '/gyms',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['gyms'],
      summary: 'create gym',
      body: CreateGymsBodySchema,
      response: {
        200: GymsResponseSchema,
      },
    },
    handler: createController,
  })
}
