import { Injectable, NotAcceptableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Order, OrderItem, OrderStatus } from '@prisma/client';
import { ExecutionOrderDTO } from './dto/order-execution.dto';
import { OrderItemsService } from '../order-items/order-items.service';
import { OrdersService } from '../orders/order.service';
import { ProductsService } from '../products/products.service';
import { PaymentDetailsDTO } from '../payment/dto/payment-details.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly httpService: HttpService,
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
    private readonly productsService: ProductsService,
  ) {}

  async processOrder(data: ExecutionOrderDTO): Promise<string> {
    const order = await this.getOrder(data.orderId);
    this.checkOrderStatus(order);

    await this.validateProductAvailability(data.orderId);

    await this.processPayment({
      cardNumber: data.cardNumber,
      expirationDate: data.expirationDate,
      cvv: data.cvv,
      amount: parseFloat(order.total.toString()),
    });

    await this.updateOrderStatus(order.id, OrderStatus.IN_PREPARATION);
    await this.updateStockQuantity(data.orderId);
    await this.updateOrderStatus(order.id, OrderStatus.DELIVERED);

    return 'Payment approved and the order has been dispatched.';
  }

  private async getOrder(orderId: string): Promise<Order> {
    try {
      const order = (await this.ordersService.detailOrder({
        id: orderId,
      })) as unknown as Order;
      return order;
    } catch (error) {
      throw new NotAcceptableException('Order not found.');
    }
  }

  private checkOrderStatus(order: Order): void {
    if (
      order.orderStatus === OrderStatus.DISPATCHED ||
      order.orderStatus === OrderStatus.DELIVERED
    ) {
      throw new NotAcceptableException(
        'This order has already been completed.',
      );
    }
  }

  private async validateProductAvailability(orderId: string): Promise<void> {
    try {
      const orderItems = (await this.orderItemsService.listOrderItemsByOrderId({
        orderId,
      })) as unknown as OrderItem[];

      for (const orderItem of orderItems) {
        const isAvailable =
          await this.productsService.verifyProductAvailability({
            productId: orderItem.productId,
            quantity: orderItem.quantity,
          });

        if (!isAvailable) {
          throw new NotAcceptableException(
            'Insufficient stock for one or more items in the order.',
          );
        }
      }
    } catch (error) {
      throw new NotAcceptableException(
        'Error validating product availability.',
      );
    }
  }

  private async processPayment(
    paymentDetails: PaymentDetailsDTO,
  ): Promise<void> {
    try {
      const result = (await this.callPaymentEndpoint(
        paymentDetails,
      )) as AxiosResponse;

      if (!result.data) {
        throw new NotAcceptableException('Payment was not approved.');
      }
    } catch (error) {
      throw new NotAcceptableException('Error processing payment.');
    }
  }

  private async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<void> {
    try {
      await this.ordersService.updateOrder({
        id: orderId,
        orderStatus: status,
      });
    } catch (error) {
      throw new NotAcceptableException(
        `Error updating order status to ${status}.`,
      );
    }
  }

  private async updateStockQuantity(orderId: string): Promise<void> {
    try {
      await this.orderItemsService.updateProductsStockQuantity({ orderId });
    } catch (error) {
      throw new NotAcceptableException('Error updating stock quantity.');
    }
  }

  private async callPaymentEndpoint(
    data: PaymentDetailsDTO,
  ): Promise<AxiosResponse> {
    try {
      return await this.httpService.axiosRef.post(
        'http://localhost:3000/payment-service/process',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      throw new NotAcceptableException('Error calling payment endpoint.');
    }
  }
}
