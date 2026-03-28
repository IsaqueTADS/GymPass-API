import fastifyCookie from '@fastify/cookie'
import type { FastifyInstance } from 'fastify'

export async function cookiePlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyCookie, {})
}
