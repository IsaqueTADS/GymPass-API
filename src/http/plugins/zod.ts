import type { FastifyInstance } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

export async function zodPlugin(fastify: FastifyInstance) {
  fastify.setSerializerCompiler(serializerCompiler)
  fastify.setValidatorCompiler(validatorCompiler)
}
