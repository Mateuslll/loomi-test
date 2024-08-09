import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { PrismaModule } from 'src/database/PrismaModule';
import { UserRepository } from './user.repository';
import { MailService } from '../email-service/email-service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, MailService],
})
export class UserModule {}
