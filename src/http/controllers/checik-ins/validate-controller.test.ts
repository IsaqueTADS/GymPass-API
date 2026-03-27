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

  it('Deve ser possivel o usuário validar check-in de um usuário', async () => {
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
    const checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    //fazer novo expect para resposta
  })
})
