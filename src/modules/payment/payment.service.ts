import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PaymentDetailsDTO } from './dto/payment-details.dto';

@Injectable()
export class PaymentService {
  async processPayment(
    details: PaymentDetailsDTO,
  ): Promise<boolean | NotAcceptableException> {
    try {
      if (!details) {
        throw new Error('Payment details are required');
      }
      return Math.random() < 0.5;
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
