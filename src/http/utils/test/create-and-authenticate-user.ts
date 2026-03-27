import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Isaque',
    email: 'isaque4@teste.com',
    password: '12345678',
  })

  const { body } = await request(app.server).post('/sessions').send({
    email: 'isaque4@teste.com',
    password: '12345678',
  })

  return {
    token: body.token,
  }
}
