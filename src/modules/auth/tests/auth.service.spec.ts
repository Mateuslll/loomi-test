import { Test, TestingModule } from '@nestjs/testing';
import { simpleFaker, faker } from '@faker-js/faker';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/modules/users/user.repository';
import { AuthService } from '../auth.service';
import { LoginDTO } from '../dto/login.dto';
import { UserType } from '@prisma/client';

describe('service', () => {
  let service: AuthService;
  let usersRepository: UserRepository;
  let jwtService: JwtService;

  const mockUserRepository = () => ({});
  const mockJwtService = () => ({});

  const mockUser = {
    id: simpleFaker.string.uuid(),
    name: faker.person.firstName(),
    email: 'admin@email.com',
    password: '$2b$10$cISyTx8y5FPOPaH5Q0SIzugoZQa96qtqRlmyEi6bB5evT0X/IF32u',
    type: UserType.ADMIN,
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    status: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    const loginData: LoginDTO = {
      email: 'admin@email.com',
      password: 'admin123',
    };

    it('should validate user successfully and return token', async () => {
      usersRepository.findUserByEmail = jest.fn().mockResolvedValue(mockUser);
      jwtService.sign = jest.fn().mockReturnValue('mockedToken');
      expect(await service.validateUser(loginData)).toEqual({
        token: 'mockedToken',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      usersRepository.findUserByEmail = jest.fn().mockResolvedValue(null);
      expect(await service.validateUser(loginData)).toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw NotAcceptableException if user status is false', async () => {
      const mockUserFalse = {
        id: simpleFaker.string.uuid(),
        name: faker.person.firstName(),
        email: 'admin@email.com',
        password:
          '$2b$10$cISyTx8y5FPOPaH5Q0SIzugoZQa96qtqRlmyEi6bB5evT0X/IF32u',
        type: UserType.ADMIN,
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
        status: false,
      };

      usersRepository.findUserByEmail = jest
        .fn()
        .mockResolvedValue(mockUserFalse);
      expect(await service.validateUser(loginData)).toBeInstanceOf(
        NotAcceptableException,
      );
    });

    it('should throw NotAcceptableException if password is incorrect', async () => {
      const mockUser = {
        id: simpleFaker.string.uuid(),
        name: faker.person.firstName(),
        email: 'admin@email.com',
        password:
          '$$2b$10$cISyTx8y5FPOPaH5Q0SIzugoZQa96qtqRlmyEi6bB5evT0X/IF32u',
        type: UserType.ADMIN,
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
        status: true,
      };

      const loginData: LoginDTO = {
        email: 'admin@email.com',
        password: 'senha151515',
      };

      usersRepository.findUserByEmail = jest.fn().mockResolvedValue(mockUser);
      expect(await service.validateUser(loginData)).toBeInstanceOf(
        NotAcceptableException,
      );
    });
  });
});
