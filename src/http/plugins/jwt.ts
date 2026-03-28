import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { env } from '@/env/index.js'

export const jwtPlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyJwt, {
      secret: env.JWT_SECRET,
      cookie: {
        cookieName: 'refreshToken',
        signed: false,
      },
      sign: {
        expiresIn: '10m',
      },
    })
  },
  { name: 'jwt' },
)
