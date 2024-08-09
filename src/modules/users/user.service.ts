import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { SearchUserDTO } from './dto/search.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { MailService } from '../email-service/email-service';
import { FindUserByEmailDTO } from './dto/findUserByEmailAndPassword.dto';
import { ConfirmSingUpDTO } from './dto/confirm-sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async confirmSignUp(data: ConfirmSingUpDTO) {
    try {
      return await this.userRepository.confirmSignUp(data);
    } catch (error) {
      throw new NotAcceptableException(
        'Unable to confirm sign up: ' + error.message,
      );
    }
  }

  async createUser(createUserDTO: CreateUserDTO) {
    try {
      const user = await this.userRepository.findUserByEmail({
        email: createUserDTO.email,
      });
      if (user) {
        throw new NotAcceptableException(
          'A user with this email is already registered.',
        );
      }
      const createdUser = await this.userRepository.createUser(createUserDTO);
      await this.sendConfirmationEmail(
        createUserDTO.email,
        (createdUser as unknown as User).id,
      );
      return 'Please confirm your registration by clicking the link sent to your email.';
    } catch (error) {
      throw new NotAcceptableException(
        'Unable to create user: ' + error.message,
      );
    }
  }

  async searchUserByEmail(data: FindUserByEmailDTO) {
    try {
      const user = await this.userRepository.findUserByEmail(data);
      if (user) {
        delete user.password; // Remove sensitive data
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found: ' + error.message);
    }
  }

  async searchUsers(data: SearchUserDTO) {
    try {
      return await this.userRepository.listUsers(data);
    } catch (error) {
      throw new NotFoundException('Users not found: ' + error.message);
    }
  }

  async updateUser(updateUserDTO: UpdateUserDTO) {
    try {
      if (updateUserDTO.email) {
        const user = await this.userRepository.findUserByEmail({
          email: updateUserDTO.email,
        });
        if (user) {
          throw new NotAcceptableException(
            'A user with this email is already registered.',
          );
        }
      }
      return await this.userRepository.updateUserById(updateUserDTO);
    } catch (error) {
      throw new NotAcceptableException(
        'Unable to update user: ' + error.message,
      );
    }
  }

  async deleteUser(deleteUserDTO: DeleteUserDTO) {
    try {
      return await this.userRepository.deleteUserById(deleteUserDTO);
    } catch (error) {
      throw new NotAcceptableException(
        'Unable to delete user: ' + error.message,
      );
    }
  }

  private async sendConfirmationEmail(email: string, id: string) {
    const message = `${process.env.EMAIL_CONFIRMATION_ENDPOINT}${id}`;
    await this.mailService.sendEmail(
      email,
      message,
      'Confirm your registration',
    );
  }
}
