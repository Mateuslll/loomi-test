import { Module } from '@nestjs/common';

import { MailService } from '../email-service/email-service';
import { UserRepository } from '../users/user.repository';
import { UsersService } from '../users/user.service';
import { ClientsController } from './client.controller';
import { ClientsRepository } from './client.repository';
import { ClientsService } from './client.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsRepository,
    UsersService,
    UserRepository,
    MailService,
  ],
})
export class ClientsModule {}
