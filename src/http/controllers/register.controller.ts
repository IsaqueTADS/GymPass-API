import { hash } from 'argon2'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma.js'
import { registerBodySchema } from '../routes.js'

export async function resgister(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  const password_hash = await hash(password)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (userWithSameEmail) {
    return reply.status(409).send()
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  return reply.send()
}
