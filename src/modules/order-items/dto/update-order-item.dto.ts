import { IsNumber, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateOrderItemDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
