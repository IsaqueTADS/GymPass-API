import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import { createAndAuthenticateUser, createAndAuthenticateUserAdmin } from '@/http/utils/test/create-and-authenticate-user.js'
import { prisma } from '@/lib/prisma.js'

describe('Profile Controller (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Deve ser possivel o usuário buscar academias pelo nome', async () => {
    const {token: tokenAdmin} = await createAndAuthenticateUserAdmin(app)
    const { token : tokenMember } = await createAndAuthenticateUser(app)

    const gymData = {
      title: 'Os marambosos progamers',
      description:
        'A academia onde o shape encontra a alta performance. Unimos a disciplina do treino pesado com a mentalidade dos grandes players. Venha dar um upgrade no seu físico e subir de nível com a nossa comunidade.',
      phone: '(38) 99999-1337',
      longitude: -16.8495227,
      latitude: -42.0612613,
    }

  

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(gymData)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        title: 'Somente progamador sedentario',
        description:
          'A academia onde o shape encontra a alta performance. Unimos a disciplina do treino pesado com a mentalidade dos grandes players. Venha dar um upgrade no seu físico e subir de nível com a nossa comunidade.',
        phone: '(38) 99999-1337',
        longitude: -16.8495227,
        latitude: -42.0612613,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'Os marambosos progamers' })
      .set('Authorization', `Bearer ${tokenMember}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Os marambosos progamers',
      }),
    ])
  })
})
