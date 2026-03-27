import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  AuthenticateBodySchema,
  RegisterBodySchema,
  UserResponseSchema,
} from '@/http/schemas/auth-schema.js'
import { VerifyJWT } from '../../middlewares/verify-jwt.js'
import { ErrorSchema } from '../../schemas/error-schema.js'
import { ValidationErrorSchema } from '../../schemas/validation-error-schema.js'
import { authenticateController } from './authenticate-controller.js'
import { profileController } from './profile-controller.js'
import { resgisterController } from './register-controller.js'
import { uploadUserAvatarController } from './upload-user-avatar-controller.js'

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'POST',
    url: '/users',
    schema: {
      tags: ['Auth'],
      summary: 'register user',
      body: RegisterBodySchema,
      response: {
        201: z.null(),
        400: ValidationErrorSchema,
        409: ErrorSchema,
      },
    },
    handler: resgisterController,
  })

  app.route({
    method: 'POST',
    url: '/sessions',
    schema: {
      tags: ['Auth'],
      summary: 'authenticate user',
      body: AuthenticateBodySchema,
      response: {
        200: z.object({
          token: z.string(),
        }),
        400: z.union([ValidationErrorSchema, ErrorSchema]),
      },
    },
    handler: authenticateController,
  })

  /*Auth*/

  app.route({
    method: 'GET',
    onRequest: [VerifyJWT],
    schema: {
      security: [{ bearerAuth: [] }],
      summary: 'Get user profile',
      tags: ['me'],
      response: {
        200: UserResponseSchema,
      },
    },
    url: '/me',
    handler: profileController,
  })

  app.route({
    method: 'patch',
    onRequest: [VerifyJWT],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['me'],
      summary: 'Update user avatar',
      description: 'Essa rota espera apenas um arquivo em multipart/form-data ',
      consumes: ['multipart/form-data'],
      response: {
        201: UserResponseSchema,
      },
    },
    url: '/uploads',
    handler: uploadUserAvatarController,
  })
}
