import { ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import { RegisterUserUseCase } from './register-user.use-case';

describe('RegisterUserUseCase', () => {
  const buildRepository = (
    overrides: Partial<jest.Mocked<UserRepository>> = {},
  ): jest.Mocked<UserRepository> => ({
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateName: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    ...overrides,
  });

  it('throws a ConflictException when the email is already registered', async () => {
    const userRepository = buildRepository({
      findByEmail: jest.fn().mockResolvedValue({
        id: 'user-1',
        name: 'Existing User',
        email: 'taken@example.com',
        passwordHash: 'stored-hash',
        role: Role.CUSTOMER,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });
    const useCase = new RegisterUserUseCase(userRepository);

    await expect(
      useCase.execute({
        name: 'New User',
        email: 'taken@example.com',
        password: 'a-strong-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(userRepository.create.mock.calls).toHaveLength(0);
  });
});
