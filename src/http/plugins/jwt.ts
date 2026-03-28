import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import { env } from '@/env/index.js'

export async function jwtPlugin(fastify: FastifyInstance) {
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
}
