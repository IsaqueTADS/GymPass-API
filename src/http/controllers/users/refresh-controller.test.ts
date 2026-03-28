import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Refresh Controller (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Deve ser possivel gerar um novo token a partir de um refresh token', async () => {
    await request(app.server).post('/users').send({
      name: 'Isaque',
      email: 'isaque4@teste.com',
      password: '12345678',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'isaque4@teste.com',
      password: '12345678',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies ?? [])
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({ token: expect.any(String) }),
    )
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
