import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClientDTO {
  @ApiPropertyOptional({
    title: 'user_id',
    type: String,
    required: false,
    description: 'The id of the user that created the Client.',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    title: 'fullName',
    type: String,
    required: false,
    description: 'Client`s full name.',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    title: 'contact',
    type: String,
    required: false,
    description: 'Client`s contatct.',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    title: 'address',
    type: String,
    required: false,
    description: 'Client`s address.',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
