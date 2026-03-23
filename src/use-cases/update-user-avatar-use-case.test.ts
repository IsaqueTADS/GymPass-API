import { Readable } from 'node:stream'
import { hash } from 'argon2'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUploadGateway } from '@/gateways/in-memory/in-memory-upload-gateway.js'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { InvalidFileTypeError } from './errors/Invalid-file-type-error.js'
import { UpadateUserAvatarUseCase } from './update-user-avatar-use-case.js'

let usersRepository: InMemoryUsersRepository
let uploadGateway: InMemoryUploadGateway
let sut: UpadateUserAvatarUseCase

describe('Update user avatar use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    uploadGateway = new InMemoryUploadGateway()
    sut = new UpadateUserAvatarUseCase(usersRepository, uploadGateway)
  })

  it('Deve ser possível atualizar o avatar do usuário', async () => {
    const content = 'fake-image-binary-content'

    const fakeStream = Readable.from([Buffer.from(content)])

    const userData = await usersRepository.create({
      name: 'Isaque',
      email: 'isaque@test.com',
      password_hash: await hash('123232'),
    })

    const userId = userData.id

    const fileMock = {
      filename: 'avatar.png',
      mimetype: 'image/png',
      file: fakeStream,
      encoding: '7bit',
    }

    const { user, publicId } = await sut.execute({
      userId,
      data: fileMock,
    })

    expect(user.id).toBe(userId)
    expect(publicId).toBeDefined()

    expect(uploadGateway.uploads).toHaveLength(1)
    expect(uploadGateway.uploads[0].filename).toBe('avatar.png')
  })

  it("Não deve ser possivel fazer upload de arquivos que o tipo não seja permitido (['image/jpeg', 'image/jpg', 'image/png'])", async () => {
    const content = 'fake-image-binary-content'

    const fakeStream = Readable.from([Buffer.from(content)])

    const userData = await usersRepository.create({
      name: 'Isaque',
      email: 'isaque@test.com',
      password_hash: await hash('123232'),
    })

    const userId = userData.id

    const fileMock = {
      filename: 'avatar.png',
      mimetype: 'image/gif',
      file: fakeStream,
      encoding: '7bit',
    }

    await expect(() =>
      sut.execute({
        userId,
        data: fileMock,
      }),
    ).rejects.toBeInstanceOf(InvalidFileTypeError)
    expect(uploadGateway.uploads).toHaveLength(0)
  })
})
