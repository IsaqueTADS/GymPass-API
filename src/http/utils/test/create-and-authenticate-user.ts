import { prisma } from '@/lib/prisma.js'
import { hash } from 'argon2'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Isaque',
    email: 'isaque@gmail.com',
    password: '12345678',
  })

  const { body } = await request(app.server).post('/sessions').send({
    email: 'isaque@gmail.com',
    password: '12345678',
  })

  return {
    token: body.token,
  }
}
export async function createAndAuthenticateUserAdmin(app: FastifyInstance) {
  const user = await prisma.user.create({
    data: {
    name: 'IsaqueADM',
    email: 'isaqueadm@gmail.com',
    password_hash:await hash('12345678'),
    role: "ADMIN"
    }
  })

  const { body } = await request(app.server).post('/sessions').send({
    email: 'isaqueadm@gmail.com',
    password: '12345678',
  })

  return {
    token: body.token,
    user
  }
}
