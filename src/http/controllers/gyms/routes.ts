import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import {
  CreateGymsBodySchema,
  FetchNearbyGymsQuerySchema,
  FetchNearbyGymsResponseSchema,
  GymsResponseSchema,
  SearchGymsQuerySchema,
  SearchGymsResponseSchema,
} from '@/http/schemas/gyms-schema.js'

import { VerifyJWT } from '../../middlewares/verify-jwt.js'
import { createController } from './create-controller.js'
import { nearbyController } from './nearby-controller.js'
import { searchController } from './search-controller.js'

export const gymsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', VerifyJWT)

  app.route({
    method: 'POST',
    url: '/gyms',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['gyms'],
      summary: 'create gyms',
      body: CreateGymsBodySchema,
      response: {
        200: GymsResponseSchema,
      },
    },
    handler: createController,
  })

  app.route({
    method: 'GET',
    url: '/gyms/search',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['gyms'],
      summary: 'search gyms',
      params: SearchGymsQuerySchema,
      response: {
        200: SearchGymsResponseSchema,
      },
    },
    handler: searchController,
  })

  app.route({
    method: 'GET',
    url: '/gyms/nearby',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['gyms'],
      summary: 'get nearby',
      params: FetchNearbyGymsQuerySchema,
      response: {
        200: FetchNearbyGymsResponseSchema,
      },
    },
    handler: nearbyController,
  })
}
