import { hash } from 'argon2'
import { prisma } from '@/lib/prisma.js'
import { PrismaUserRepository } from '@/repositories/prisma-users-repository.js'

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

  const prismaUsersRepository = new PrismaUserRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
