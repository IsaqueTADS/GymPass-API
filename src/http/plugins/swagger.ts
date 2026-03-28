import FastifySwagger from '@fastify/swagger'
import FastifyApiReference from '@scalar/fastify-api-reference'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import { env } from '@/env/index.js'

export const swaggerPlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(FastifySwagger, {
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

    await fastify.register(FastifyApiReference, {
      routePrefix: '/docs',
      configuration: {
        theme: 'bluePlanet',
      },
    })
  },
  { name: 'swagger' },
)
