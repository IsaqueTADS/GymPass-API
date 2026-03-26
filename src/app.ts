import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import FastifySwagger from '@fastify/swagger'
import FastifyApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { env } from './env/index.js'

import { InMemoryUploadGateway } from './gateways/in-memory/in-memory-upload-gateway.js'
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
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
await app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

await app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
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

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== 'production') {
    app.log.error(error)
  } else {
    // Algum dia eu coloco log para alguma ferramenta externa em prod, por enquanto essa validação já é suficiente
  }
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Falha na validação', details: error.format() })
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    console.error(error.message)
    return reply.code(400).send({
      message: 'Falha na validação',
      details: error.validation.map((item) => {
        return { error: item.message }
      }),
    })
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      message: 'Falha ao serializar a resposta',
      details: error.cause.issues,
    })
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
