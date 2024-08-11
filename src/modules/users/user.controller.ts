import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Query,
  ValidationPipe,
  Get,
} from '@nestjs/common';

import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfirmSingUpDTO } from './dto/confirm-sign-up.dto';
import { CreateUserAsClientDTO } from './dto/create-user-as-client.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserAsClientDTO } from './dto/update-user-as-client.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FindUserByEmailDTO } from './dto/findUserByEmailAndPassword.dto';
import { SearchUserDTO } from './dto/search.dto';
import { UserType } from '@prisma/client';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { UsersService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @Get('confirm-signup')
  async confirmSignUp(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    data: ConfirmSingUpDTO,
  ) {
    try {
      await this.usersService.confirmSignUp(data);
      return 'Cadastro confirmado.';
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint accesible to administrators only, to create a new user of any type, returning it's data.`,
  })
  @Post('admin')
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    try {
      return await this.usersService.createUser(createUserDTO);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint to create a new user that's a client, returning it's data.`,
  })
  @Post()
  async createUserAsClient(
    @Body() createUserAsClientDTO: CreateUserAsClientDTO,
  ) {
    try {
      return await this.usersService.createUser({
        ...createUserAsClientDTO,
        role: UserType.USER,
      });
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint accesible to administrators only, retrive a user's data given it's e-mail.`,
  })
  @Get()
  async searchUserByEmail(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: FindUserByEmailDTO,
  ) {
    try {
      return await this.usersService.searchUserByEmail(query);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint accesible to administrators only, to make a search for users, that's paginated and can receive some of his properties to be used as filters on that search.`,
  })
  @Get('search')
  async searchUser(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: SearchUserDTO,
  ) {
    try {
      return await this.usersService.searchUsers(query);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint to update client user's properties given the new value of the property to be updated, returning the user's data updated.`,
  })
  @Patch()
  async updateUser(@Body() updateUserAsClientDTO: UpdateUserAsClientDTO) {
    try {
      return await this.usersService.updateUser({
        ...updateUserAsClientDTO,
        id: updateUserAsClientDTO.userId,
      });
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint only accessible to users of type administrator. Allows the administrator to update the data of any user.`,
  })
  @Patch('admin')
  async updateUserAsAdmin(@Body() updateUserDTO: UpdateUserDTO) {
    try {
      return await this.usersService.updateUser(updateUserDTO);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint to remove a user's data from the database.`,
  })
  @Delete()
  async deleteUser(data: DeleteUserDTO) {
    try {
      return await this.usersService.deleteUser(data);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint only accessible to users of type administrator. Allows the administrator to delete any user.`,
  })
  @Delete('admin')
  async deleteUserAsAdmin(@Body() data: DeleteUserDTO) {
    try {
      return await this.usersService.deleteUser(data);
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
