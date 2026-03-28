import type { FastifyInstance } from 'fastify'
import { cookiePlugin } from './cookie.js'
import { errorHandlerPlugin } from './error-handler.js'
import { jwtPlugin } from './jwt.js'
import { multipartPlugin } from './multipart.js'
import { swaggerPlugin } from './swagger.js'
import { zodPlugin } from './zod.js'

export async function registerHttpPlugins(fastify: FastifyInstance) {
  await fastify.register(zodPlugin)
  await fastify.register(swaggerPlugin)
  await fastify.register(multipartPlugin)
  await fastify.register(cookiePlugin)
  await fastify.register(jwtPlugin)
  await fastify.register(errorHandlerPlugin)
}
