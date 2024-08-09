import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { Order } from '@prisma/client';
import { OrderItemsService } from '../order-items/order-items.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { DeleteOrderDTO } from './dto/delete-order.dto';
import { GetOrderDTO } from './dto/get-order.dto';
import { SearchOrderDTO } from './dto/search-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { OrdersRepository } from './order.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  async createOrder(data: CreateOrderDTO) {
    try {
      const order = (await this.ordersRepository.createOrder(
        data,
      )) as unknown as Order;

      await this.orderItemsService.createOrderItem({
        orderId: (order as unknown as Order).id,
        productId: data.productId,
        quantity: data.quantity,
      });

      return await this.ordersRepository.detailOrder({ id: order.id });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async detailOrder(data: GetOrderDTO) {
    try {
      return await this.ordersRepository.detailOrder(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async searchOrder(data: SearchOrderDTO) {
    try {
      return await this.ordersRepository.listOrders(data);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async updateOrder(data: UpdateOrderDTO) {
    try {
      return await this.ordersRepository.updateOrder(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteOrder(data: DeleteOrderDTO) {
    try {
      return await this.ordersRepository.deleteOrder(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
