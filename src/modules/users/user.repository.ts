import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { ConfirmSingUpDTO } from './dto/confirm-sign-up.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { FindUserByEmailDTO } from './dto/findUserByEmailAndPassword.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { hashPassword } from 'src/utils/bcrypt.utils';
import { SearchUserDTO } from './dto/search.dto';

@Injectable()
export class UserRepository {
  prisma = new PrismaClient();

  async createUser(data: CreateUserDTO) {
    try {
      data.password = hashPassword(data.password);
      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        },
      });
      delete user['password'];
      return user;
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async findUserByEmail(data: FindUserByEmailDTO) {
    return await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
  }

  async listUsers(data: SearchUserDTO) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          email: data.email ? { equals: data.email } : undefined,
          name: data.name
            ? { contains: data.name, mode: 'insensitive' }
            : undefined,
          role: data.type ? { equals: data.type } : undefined,
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

      return { users };
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async updateUserById(data: UpdateUserDTO) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
      delete user['password'];
      return user;
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteUserById(data: DeleteUserDTO) {
    return await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }

  async confirmSignUp(data: ConfirmSingUpDTO) {
    try {
      const user = await this.prisma.user.update({
        where: { id: data.id },
        data: {
          status: true,
        },
      });
      delete user['password'];
      return user;
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
