import { hash } from 'argon2'
import { prisma } from '@/lib/prisma.js'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Email already exists')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
