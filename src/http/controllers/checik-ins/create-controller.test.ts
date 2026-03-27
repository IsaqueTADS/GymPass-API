import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/http/utils/test/create-and-authenticate-user.js'
import { prisma } from '@/lib/prisma.js'

describe('Profile Controller (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Deve ser possivel o usuário realizar check-in em uma academia', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gymData = {
      title: 'Os marambosos progamers',
      description:
        'A academia onde o shape encontra a alta performance. Unimos a disciplina do treino pesado com a mentalidade dos grandes players. Venha dar um upgrade no seu físico e subir de nível com a nossa comunidade.',
      phone: '(38) 99999-1337',
      longitude: -16.8495227,
      latitude: -42.0612613,
    }

    const gym = await prisma.gym.create({ data: gymData })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -42.0612613,
        userLongitude: -16.8495227,
      })

    expect(response.statusCode).toEqual(201)
  })
})
