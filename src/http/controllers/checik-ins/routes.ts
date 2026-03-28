import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  CheckInResponseSchema,
  CheckInsResponseSchema,
  CreateCheckInBodySchema,
  CreateCheckInParamsSchema,
  FetchUserCheckInsHistoryQuerySchema,
  UserMetricsResponseSchema,
  ValidateCheckInParamsSchema,
} from '@/http/schemas/check-ins-schema.js'
import { VerifyJWT } from '../../middlewares/verify-jwt.js'
import { createController } from './create-controller.js'
import { historyController } from './history-controller.js'
import { metricsController } from './metrics-controller.js'
import { validateController } from './validate-controller.js'

export const checkInsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', VerifyJWT)

  app.route({
    method: 'POST',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['check-ins'],
      summary: 'create checkin',
      params: CreateCheckInParamsSchema,
      body: CreateCheckInBodySchema,
      response: {
        201: CheckInResponseSchema,
      },
    },
    url: '/gyms/:gymId/check-ins',
    handler: createController,
  })

  app.route({
    method: 'PATCH',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['check-ins'],
      summary: 'validate checkin',
      params: ValidateCheckInParamsSchema,
      response: {
        200: CheckInResponseSchema,
      },
    },
    url: '/check-ins/:checkInId/validade',
    handler: validateController,
  })
  app.route({
    method: 'GET',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['check-ins'],
      summary: 'get history checkin',
      querystring: FetchUserCheckInsHistoryQuerySchema,
      response: {
        200: CheckInsResponseSchema,
      },
    },
    url: '/check-ins/history',
    handler: historyController,
  })
  app.route({
    method: 'GET',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['check-ins'],
      summary: 'get metrics checkin',
      response: {
        200: UserMetricsResponseSchema,
      },
    },
    url: '/check-ins/metrics',
    handler: metricsController,
  })
}
