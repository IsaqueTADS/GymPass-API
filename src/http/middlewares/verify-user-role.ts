import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Role } from '@/generated/prisma/enums.js'

export function VerifyUserRole(roleVerify: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleVerify) {
      return reply.status(401).send({ message: 'Não autorizado' })
    }
  }
}
