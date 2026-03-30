import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma.js'

export async function VerifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    const user = await prisma.user.findUnique({
      where: {
        id: request.user.sub,
      },
    })

    if (!user) {
      return reply.status(401).send({ message: 'Não autorizado' })
    }
  } catch {
    return reply.status(401).send({ message: 'Não autorizado' })
  }
}
