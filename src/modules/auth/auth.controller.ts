import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @ApiOperation({
    summary: `Endpoint to authenticate a user with it's email and password, returning the corresponding token.`,
  })
  @Post('login')
  async userLogin(@Body() data: LoginDTO) {
    try {
      return await this.authenticationService.validateUser(data);
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
