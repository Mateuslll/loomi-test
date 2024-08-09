import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentDetailsDTO } from './dto/payment-details.dto';

@Controller('payment-details')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiExcludeEndpoint()
  @Post('process')
  async processPayment(
    @Body() details: PaymentDetailsDTO,
  ): Promise<{ success: boolean } | BadRequestException> {
    try {
      const paymentApproved = await this.paymentService.processPayment(details);
      return { success: paymentApproved as unknown as boolean };
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
