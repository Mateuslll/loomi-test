import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importando o JwtModule
import { AuthService } from './auth.service'; // Serviço de autenticação
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/database/PrismaModule';
import { UserRepository } from '../users/user.repository';
import { ClientsRepository } from '../clients/client.repository';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Chave secreta para JWT
      signOptions: { expiresIn: '1h' }, // Expiração do token
    }),
    PrismaModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController], // Controladores que fazem parte do módulo
  providers: [AuthService, UserRepository, ClientsRepository], // Serviços fornecidos por este módulo
})
export class AuthModule {}
