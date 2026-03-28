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

  it('Deve ser possivel obter o seu histórico de check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gymData = {
      title: 'Os marambosos progamers',
      description:
        'A academia onde o shape encontra a alta performance. Unimos a disciplina do treino pesado com a mentalidade dos grandes players. Venha dar um upgrade no seu físico e subir de nível com a nossa comunidade.',
      phone: '(38) 99999-1337',
      longitude: -16.8495227,
      latitude: -42.0612613,
    }

    const gym = await prisma.gym.create({ data: gymData })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ])
  })
})
