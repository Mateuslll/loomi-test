import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateUserAsClientDTO } from './create-user-as-client.dto';
import { UserType } from '@prisma/client';

export class CreateUserDTO extends CreateUserAsClientDTO {
  @ApiProperty({
    title: 'type',
    type: UserType,
    enum: UserType,
    required: true,
    description: ' User`s type, Admin or Client.',
  })
  @IsNotEmpty()
  @IsEnum(UserType)
  role: UserType;
}
