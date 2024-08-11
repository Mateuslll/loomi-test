import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetClientDTO {
  @ApiProperty({
    title: 'id',
    type: String,
    required: true,
    description: 'Id of clients the to be retrieved.',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
