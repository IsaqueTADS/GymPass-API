import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Profile Controller (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Deve ser possivel obter o perfil de um usuário logado', async () => {
    await request(app.server).post('/users').send({
      name: 'Isaque',
      email: 'isaque4@teste.com',
      password: '12345678',
    })

    const { body } = await request(app.server).post('/sessions').send({
      email: 'isaque4@teste.com',
      password: '12345678',
    })

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        name: 'Isaque',
        email: 'isaque4@teste.com',
      }),
    })
  })
})
