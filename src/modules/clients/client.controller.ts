import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateClientDTO } from './dto/create-client.dto';
import { DeleteClientDTO } from './dto/delete-client.dto';
import { GetClientDTO } from './dto/get-client.dto';
import { SearchClientDTO } from './dto/search-client.dto';
import { UpdateClientAsAdminDTO } from './dto/update-client-as-admin.dto';
import { UpdateClientDTO } from './dto/update-client-as-user.dto';
import { ClientsService } from './client.service';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({
    summary: `Endpoint to create a new client, returning it's data.`,
  })
  @Post()
  async createClient(@Body() data: CreateClientDTO, @Request() req) {
    try {
      return await this.clientsService.createClient(data, req.user.id);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint retrive a client's data given it's Id.`,
  })
  @Get()
  async getClient(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: GetClientDTO,
  ) {
    try {
      return await this.clientsService.detailClient(query);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint to make a search for clients, that's paginated and can receive some of his properties to be used as filters on that search.`,
  })
  @Get('search')
  async searchClient(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: SearchClientDTO,
  ) {
    try {
      return await this.clientsService.searchClients(query);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint to update one or more client's properties given the new value of the property to be updated, returning the client's data updated.`,
  })
  @Patch()
  async updateClient(@Body() data: UpdateClientDTO, @Request() req) {
    try {
      return await this.clientsService.updateClient(data, req.user.id);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint only accessible to users of type administrator. Allows the administrator to update the data of any client.`,
  })
  @Patch('admin')
  async updateClientAsAdmin(@Body() data: UpdateClientAsAdminDTO) {
    try {
      return await this.clientsService.updateClientAsAdmin(data);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint to remove the current logged in client's data from the database, also remove it's user's data.`,
  })
  @Delete()
  async deleteClient(@Request() req) {
    try {
      return await this.clientsService.deleteClient({
        userId: req.user.id,
      });
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: `Endpoint only accessible to users of type administrator. Allows the administrator to delete any client.`,
  })
  @Delete('admin')
  async deleteClientAsAdmin(@Body() data: DeleteClientDTO) {
    try {
      return await this.clientsService.deleteClient(data);
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
