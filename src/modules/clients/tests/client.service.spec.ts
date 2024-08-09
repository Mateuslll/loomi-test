import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { simpleFaker, faker } from '@faker-js/faker';

import { MailService } from '../../email-service/email-service';
import { UserRepository } from 'src/modules/users/user.repository';
import { UsersService } from 'src/modules/users/user.service';
import { ClientsRepository } from '../client.repository';
import { ClientsService } from '../client.service';
import { CreateClientDTO } from '../dto/create-client.dto';
import { DeleteClientDTO } from '../dto/delete-client.dto';
import { GetClientDTO } from '../dto/get-client.dto';
import { SearchClientDTO } from '../dto/search-client.dto';
import { UpdateClientDTO } from '../dto/update-client-as-user.dto';

describe('service', () => {
  let service: ClientsService;
  let userService: UsersService;
  let customersRepository: ClientsRepository;

  const mockClientsRepository = () => ({});
  const mockUserRepository = () => ({});
  const mockMailerService = () => ({});

  const mockClient = {
    id: simpleFaker.string.uuid(),
    name: faker.person.firstName(),
    description: faker.string.sample(),
    price: faker.number.int(),
    stockQuantity: faker.number.int(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        UsersService,
        { provide: ClientsRepository, useFactory: mockClientsRepository },
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: MailService, useFactory: mockMailerService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    userService = module.get<UsersService>(UsersService);
    customersRepository = module.get<ClientsRepository>(ClientsRepository);
  });

  describe('createClient', () => {
    const data: CreateClientDTO = {
      fullName: faker.person.firstName(),
      contactPhone: faker.string.sample(),
      address: faker.string.sample(),
    };

    it('should create a customer', async () => {
      customersRepository.createClient = jest
        .fn()
        .mockResolvedValue(mockClient);

      const result = await service.createClient(
        data,
        simpleFaker.string.uuid(),
      );
      expect(result).toEqual(mockClient);
    });

    it('should handle error and return NotAcceptableException', async () => {
      const mockError = new Error('Error message');
      customersRepository.createClient = jest.fn().mockRejectedValue(mockError);

      const result = await service.createClient(
        data,
        simpleFaker.string.uuid(),
      );
      expect(result).toBeInstanceOf(NotAcceptableException);
    });
  });

  describe('detailClient', () => {
    const data: GetClientDTO = {
      id: simpleFaker.string.uuid(),
    };

    it('should return a customer', async () => {
      customersRepository.detailClient = jest
        .fn()
        .mockResolvedValue(mockClient);

      const result = await service.detailClient(data);
      expect(result).toEqual(mockClient);
    });

    it('should handle error and return NotFoundException', async () => {
      const mockError = new Error('Error message');
      customersRepository.detailClient = jest.fn().mockRejectedValue(mockError);

      const result = await service.detailClient(data);
      expect(result).toBeInstanceOf(NotFoundException);
    });
  });

  describe('searchClients', () => {
    const data: SearchClientDTO = {
      page: faker.number.int(),
      records_per_page: faker.number.int(),
    };

    it('should search customers', async () => {
      customersRepository.listClients = jest
        .fn()
        .mockResolvedValue({ customers: [mockClient] });

      const result = await service.searchClients(data);
      expect(result).toEqual({ customers: [mockClient] });
    });

    it('should handle error and return NotFoundException', async () => {
      const mockError = new Error('Error message');
      customersRepository.listClients = jest.fn().mockRejectedValue(mockError);

      const result = await service.searchClients(data);
      expect(result).toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateClient', () => {
    const data: UpdateClientDTO = {
      fullName: faker.person.firstName(),
    };

    it('should update a customer', async () => {
      customersRepository.updateClient = jest
        .fn()
        .mockResolvedValue(mockClient);

      const result = await service.updateClient(
        data,
        simpleFaker.string.uuid(),
      );
      expect(result).toEqual(mockClient);
    });

    it('should handle error and return NotAcceptableException', async () => {
      const mockError = new Error('Error message');
      customersRepository.updateClient = jest.fn().mockRejectedValue(mockError);

      const result = await service.updateClient(
        data,
        simpleFaker.string.uuid(),
      );
      expect(result).toBeInstanceOf(NotAcceptableException);
    });
  });

  describe('deleteClient', () => {
    const data: DeleteClientDTO = {
      userId: simpleFaker.string.uuid(),
    };

    it('should delete a customer', async () => {
      customersRepository.findClientByUserId = jest
        .fn()
        .mockResolvedValue(mockClient);
      customersRepository.deleteClient = jest
        .fn()
        .mockResolvedValue(mockClient);
      userService.deleteUser = jest.fn().mockResolvedValue(null);
      const result = await service.deleteClient(data);
      expect(result).toEqual(mockClient);
    });

    it('should handle error and return NotAcceptableException', async () => {
      const mockError = new Error('Error message');
      customersRepository.deleteClient = jest.fn().mockRejectedValue(mockError);

      const result = await service.deleteClient(data);
      expect(result).toBeInstanceOf(NotAcceptableException);
    });
  });
});
