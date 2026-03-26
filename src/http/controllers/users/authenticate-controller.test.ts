import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Authenticate Controller (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Deve ser possivel se autenticar', async () => {
    await request(app.server).post('/users').send({
      name: 'Isaque',
      email: 'isaque4@teste.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'isaque4@teste.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({ token: expect.any(String) }),
    )
  })
})
