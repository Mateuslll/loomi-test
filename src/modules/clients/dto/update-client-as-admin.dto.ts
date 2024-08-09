import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UpdateClientDTO } from './update-client-as-user.dto';

export class UpdateClientAsAdminDTO extends UpdateClientDTO {
  @ApiProperty({
    title: 'id',
    type: String,
    required: true,
    description: 'The id of the Client to be updated.',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
