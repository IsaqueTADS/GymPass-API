import FastifySwagger from '@fastify/swagger'
import FastifyApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from './env/index.js'
import { resgister } from './http/controllers/register.controller.js'
import { appRoutes } from './http/routes.js'

const envToLogger = {
  dev: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

export const app = fastify({
  logger: envToLogger[env.NODE_ENV] ?? true,
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

await app.register(FastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'GymPass API',
      description:
        'A RESTful API built with Fastify for managing gym check-ins, users, and fitness locations. It provides secure authentication, location-based gym search, user registration, and check-in tracking. Designed with scalability and clean architecture principles to support modern fitness applications.',
      version: '0.1.0',
    },
    servers: [
      {
        url: env.API_URL,
        description: 'Development server',
      },
    ],
  },
  transform: jsonSchemaTransform,
})

await app.register(FastifyApiReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'bluePlanet',
  },
})

app.get(
  '/',
  {
    schema: {
      response: {
        200: z.object({
          hello: z.string(),
        }),
      },
    },
  },
  (request, reply) => {
    request.log.info('Some info about the current request')
    reply.status(200).send({ hello: 'world' })
  },
)

app.register(appRoutes)
