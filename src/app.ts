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
import { UploadClaudinaryGateway } from './gateways/claudinary/upload-claudinary-gateway.js'
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
await app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
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

  return reply.status(500).send('Internal server error.')
})

app.route({
  method: 'patch',
  url: '/uploads',
  handler: async (request, reply) => {
    const data = await request.file()

    if (!data)
      return reply.status(400).send({ error: 'Nenhum arquivo enviado' })

    // Define uma promessa para o upload do Cloudinary
    // const uploadToCloudinary = () => {
    //   return new Promise((resolve, reject) => {
    //     // Criar stream de upload
    //     const stream = cloudinary.uploader.upload_stream(
    //       { folder: 'fastify_uploads' }, // Opcional: pasta no Cloudinary
    //       (error, result) => {
    //         if (result) resolve(result)
    //         else reject(error)
    //       },
    //     )
    //     // "Pipar" o arquivo recebido para o stream do Cloudinary
    //     data.file.pipe(stream)
    //   })
    // }

    try {
      const UploadGateway = new UploadClaudinaryGateway()

      const result = await UploadGateway.sendUploadFile(data)

      console.log(result)
      console.log("olá")

      return {
        message: 'Upload bem-sucedido!',
        url: result.secure_url,
        public_id: result.public_id,
      }
    } catch (error: any) {
      return reply.status(500).send({ error: error.message })
    }
  },
})
