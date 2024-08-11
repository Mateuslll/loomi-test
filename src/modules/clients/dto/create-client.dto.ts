import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDTO {
  @ApiProperty({
    title: 'fullName',
    type: String,
    required: true,
    description: 'Client`s full name.',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    title: 'contactPhone',
    type: String,
    required: true,
    description: 'Client`s contatct.',
  })
  @IsNotEmpty()
  @IsString()
  contactPhone: string;

  @ApiProperty({
    title: 'address',
    type: String,
    required: true,
    description: 'Client`s address.',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    title: 'userId',
    type: String,
    required: true,
    description: 'ID of the associated user.',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
