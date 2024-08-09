import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserRepository } from '../users/user.repository';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(data: LoginDTO): Promise<{ token: string }> {
    const user = await this.userRepository.findUserByEmail({
      email: data.email,
    });

    if (!user) {
      throw new NotFoundException('Credenciais inválidas.');
    }

    if (user.status === false) {
      throw new NotAcceptableException(
        'Confirme o cadastro do usuário para poder acessar a plataforma.',
      );
    }

    if (!compareSync(data.password, user.password)) {
      throw new NotAcceptableException('Credenciais inválidas.');
    }

    user.password = undefined; // Remover a senha antes de retornar o usuário

    return this.login(user);
  }

  private login(user: User): { token: string } {
    return { token: this.jwtService.sign(user) };
  }
}
