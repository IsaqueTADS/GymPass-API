import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { env } from './env/index.js'
import { checkInsRoutes } from './http/controllers/checik-ins/routes.js'
import { gymsRoutes } from './http/controllers/gyms/routes.js'
import { usersRoutes } from './http/controllers/users/routes.js'
import { registerHttpPlugins } from './http/plugins/index.js'

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

await app.register(registerHttpPlugins)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)
