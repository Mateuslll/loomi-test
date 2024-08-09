import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateClientDTO } from './dto/create-client.dto';
import { DeleteClientDTO } from './dto/delete-client.dto';
import { GetClientDTO } from './dto/get-client.dto';
import { UpdateClientAsAdminDTO } from './dto/update-client-as-admin.dto';
import { UpdateClientDTO } from './dto/update-client-as-user.dto';
import { SearchClientDTO } from './dto/search-client.dto';

@Injectable()
export class ClientsRepository {
  prisma = new PrismaClient();

  async createClient(data: CreateClientDTO, user_id: string) {
    try {
      return await this.prisma.client.create({
        data: {
          address: data.address,
          contactPhone: data.contactPhone,
          fullName: data.fullName,
          user: {
            connect: {
              id: user_id,
            },
          },
        },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async detailClient(data: GetClientDTO) {
    try {
      return await this.prisma.client.findUnique({
        where: { id: data.id },
      });
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async findClientByUserId(data: DeleteClientDTO) {
    try {
      return await this.prisma.client.findUnique({
        where: {
          userId: data.userId,
        },
      });
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async listClients(data: SearchClientDTO) {
    try {
      const clients = await this.prisma.client.findMany({
        where: {
          fullName: data.fullName
            ? { contains: data.fullName, mode: 'insensitive' }
            : undefined,
          contactPhone: data.contactPhone
            ? { contains: data.contactPhone, mode: 'insensitive' }
            : undefined,
          address: data.address ? { equals: data.address } : undefined,
          status: data.status !== undefined ? data.status : undefined,
          createdAt:
            data.date_start && data.date_end
              ? {
                  gte: new Date(data.date_start),
                  lte: new Date(data.date_end),
                }
              : undefined,
        },
        take: data.records_per_page,
        skip: (data.page - 1) * data.records_per_page,
      });

      return { clients };
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async updateClientAsAdmin(data: UpdateClientAsAdminDTO) {
    try {
      const { id, ...parameters } = data;
      return await this.prisma.client.update({
        where: {
          id: id,
        },
        data: {
          ...parameters,
        },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateClient(data: UpdateClientDTO, user_id: string) {
    try {
      return await this.prisma.client.update({
        where: {
          userId: user_id,
        },
        data: data,
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteClient(data: { id: string }) {
    try {
      return await this.prisma.client.delete({ where: { id: data.id } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
