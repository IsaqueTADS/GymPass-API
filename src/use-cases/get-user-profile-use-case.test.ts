import { hash } from 'argon2'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { GetUserProfileUseCase } from './get-user-profile-use-case.js'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('Deve ser possivel obter o perfil de um usuário logado', async () => {
    const creatUser = await usersRepository.create({
      name: 'Testador',
      email: 'testador@gmail.com',
      password_hash: await hash('123456'),
    })

    const { user } = await sut.execute({ userId: creatUser.id })

    expect(user.name).toEqual('Testador')
  })

  it('Não deve ser possivel buscar um perfil de um usuario não existente', async () => {
    await expect(() =>
      sut.execute({ userId: 'não-existe-mesmo-esse-id-seloco-não-compensa' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
