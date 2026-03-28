import fastifyMultipart from '@fastify/multipart'
import type { FastifyInstance } from 'fastify'

export async function multipartPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  })
}
