import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/http/utils/test/create-and-authenticate-user.js'

describe('Profile Controller (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Deve ser possivel cadastrar uma academia', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gymData = {
      title: 'Os marambosos progamers',
      description:
        'A academia onde o shape encontra a alta performance. Unimos a disciplina do treino pesado com a mentalidade dos grandes players. Venha dar um upgrade no seu físico e subir de nível com a nossa comunidade.',
      phone: '(38) 99999-1337',
      longitude: -16.8495227,
      latitude: -42.0612613,
    }

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gymData)

    expect(response.statusCode).toEqual(201)
    expect(response.body.gym).toEqual(expect.objectContaining(gymData))
  })
})
