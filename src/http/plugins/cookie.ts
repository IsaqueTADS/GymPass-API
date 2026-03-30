import fastifyCookie from '@fastify/cookie'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export const cookiePlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCookie, {})
  },
  { name: 'cookie' },
)
