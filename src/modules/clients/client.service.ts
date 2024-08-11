import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { Client } from '@prisma/client';
import { ClientsRepository } from './client.repository';
import { CreateClientDTO } from './dto/create-client.dto';
import { DeleteClientDTO } from './dto/delete-client.dto';
import { GetClientDTO } from './dto/get-client.dto';
import { SearchClientDTO } from './dto/search-client.dto';
import { UpdateClientAsAdminDTO } from './dto/update-client-as-admin.dto';
import { UpdateClientDTO } from './dto/update-client-as-user.dto';
import { UsersService } from '../users/user.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly userService: UsersService,
  ) {}

  async createClient(data: CreateClientDTO, user_id: string) {
    try {
      return await this.clientsRepository.createClient(data, user_id);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async detailClient(data: GetClientDTO) {
    try {
      return await this.clientsRepository.detailClient(data);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async searchClients(data: SearchClientDTO) {
    try {
      return await this.clientsRepository.listClients(data);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async updateClient(data: UpdateClientDTO, user_id: string) {
    try {
      return await this.clientsRepository.updateClient(data, user_id);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateClientAsAdmin(data: UpdateClientAsAdminDTO) {
    try {
      return await this.clientsRepository.updateClientAsAdmin(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteClient(data: DeleteClientDTO) {
    try {
      const clientId = (
        (await this.clientsRepository.findClientByUserId(
          data,
        )) as unknown as Client
      ).id;
      const client = await this.clientsRepository.deleteClient({
        id: clientId,
      });
      await this.userService.deleteUser({ id: data.userId });
      return client;
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
