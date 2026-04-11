import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { VerifyUserRole } from '@/http/middlewares/verify-user-role.js'
import {
  CreateGymsBodySchema,
  FetchNearbyGymsQuerySchema,
  FetchNearbyGymsResponseSchema,
  GymsResponseSchema,
  SearchGymsQuerySchema,
  SearchGymsResponseSchema,
  UploadImageParamsSchema,
} from '@/http/schemas/gyms-schema.js'
import { VerifyJWT } from '../../middlewares/verify-jwt.js'
import { createController } from './create-controller.js'
import { nearbyController } from './nearby-controller.js'
import { searchController } from './search-controller.js'
import { uploadImageController } from './upload-image-controller.js'

export const gymsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', VerifyJWT)

  app.route({
    method: 'POST',
    url: '/gyms',
    onRequest: [VerifyUserRole('ADMIN')],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['gyms'],
      summary: 'create gyms',
      body: CreateGymsBodySchema,
      response: {
        201: GymsResponseSchema,
      },
    },
    handler: createController,
  })
  app.route({
    method: 'PATCH',
    url: '/gyms/:gymId/upload',
    onRequest: [VerifyUserRole('ADMIN')],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['gyms'],
      summary: 'upload image to gyms',
      params: UploadImageParamsSchema,
      response: {
        200: GymsResponseSchema,
      },
    },
    handler: uploadImageController,
  })

  //MEMBER ACESS
  app.route({
    method: 'GET',
    url: '/gyms/search',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['gyms'],
      summary: 'search gyms',
      querystring: SearchGymsQuerySchema,
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
      querystring: FetchNearbyGymsQuerySchema,
      response: {
        200: FetchNearbyGymsResponseSchema,
      },
    },
    handler: nearbyController,
  })
}
