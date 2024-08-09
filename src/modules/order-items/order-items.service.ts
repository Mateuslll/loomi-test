import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { Order, OrderItem, Product } from '@prisma/client';
import { ProductsService } from 'src/modules/products/products.service';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';
import { DeleteOrderItemDTO } from './dto/delete-order-item.dto';
import { GetOrderItemDTO } from './dto/get-order-item.dto';
import { SearchOrderItemDTO } from './dto/search-order-item.dto';
import { UpdateOrderItemDTO } from './dto/update-order-item.dto';
import { OrderItemsRepository } from './order-items.repository';
import { OrdersRepository } from '../orders/order.repository';
import { ListOrderItemsByOrderId } from './dto/list-order-items-by-order-id.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly productsService: ProductsService,
    private readonly orderRepository: OrdersRepository,
  ) {}

  async createOrderItem(data: CreateOrderItemDTO) {
    try {
      const unitPrice: number = (await this.getUnitPrice(
        data.productId,
      )) as unknown as number;

      const subtotal: number = unitPrice * data.quantity;

      const availability = await this.productsService.verifyProductAvailability(
        {
          productId: data.productId,
          quantity: data.quantity,
        },
      );

      if (!availability) {
        throw new NotAcceptableException(
          'Não há itens suficientes em estoque para atender esse item do pedido.',
        );
      }

      const orderItem: OrderItem =
        (await this.orderItemsRepository.createOrderItem(
          data,
          unitPrice,
          subtotal,
        )) as unknown as OrderItem;

      await this.updateOrderTotal({
        subtotal: subtotal,
        orderId: data.orderId,
        increase: true,
      });

      return orderItem;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  async detailOrderItem(data: GetOrderItemDTO) {
    try {
      return await this.orderItemsRepository.detailOrderItem(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async searchOrderItem(data: SearchOrderItemDTO) {
    try {
      return await this.orderItemsRepository.listOrderItem(data);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async listOrderItemsByOrderId(data: ListOrderItemsByOrderId) {
    try {
      return await this.orderItemsRepository.listOrderItemsByOrderId(data);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async updateOrderItem(data: UpdateOrderItemDTO) {
    try {
      const currentOrderItem: OrderItem =
        (await this.orderItemsRepository.detailOrderItem({
          id: data.id,
        })) as unknown as OrderItem;

      const availability = await this.productsService.verifyProductAvailability(
        {
          productId: currentOrderItem.productId,
          quantity: currentOrderItem.quantity,
        },
      );

      if (!availability) {
        return new NotAcceptableException(
          'Não há itens suficientes em estoque para atender esse item do pedido.',
        );
      }

      if (data.quantity == currentOrderItem.quantity)
        return new NotAcceptableException('Não há alteração nos dados.');

      const unitPrice: number = (await this.getUnitPrice(
        currentOrderItem.productId,
      )) as unknown as number;

      let subtotal: number;
      let increase: boolean;
      let amount: number;

      if (data.quantity < currentOrderItem.quantity) {
        amount = (currentOrderItem.quantity - data.quantity) * unitPrice;
        subtotal = parseFloat(currentOrderItem.subtotal.toString()) - amount;
        increase = false;
      } else if (data.quantity > currentOrderItem.quantity) {
        amount = (data.quantity - currentOrderItem.quantity) * unitPrice;
        subtotal = parseFloat(currentOrderItem.subtotal.toString()) + amount;
        increase = true;
      }

      const orderItem: OrderItem =
        (await this.orderItemsRepository.updateOrderItem(
          data,
          subtotal,
        )) as unknown as OrderItem;

      if (data.quantity == 0) await this.deleteOrderItem({ id: data.id });

      await this.updateOrderTotal({
        orderId: orderItem.orderId,
        increase: increase,
        amount: amount,
      });
      return orderItem;
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteOrderItem(data: DeleteOrderItemDTO) {
    try {
      const orderItem: OrderItem =
        (await this.orderItemsRepository.detailOrderItem({
          id: data.id,
        })) as unknown as OrderItem;

      const result = await this.orderItemsRepository.deleteOrderItem(data);

      const numberOfOrderItemsLeft: number = (
        (await this.searchOrderItem({
          orderId: orderItem.orderId,
          page: 1,
          records_per_page: 10,
        })) as unknown as { OrderItems: Array<OrderItem> }
      ).OrderItems.length;

      if (numberOfOrderItemsLeft == 0)
        await this.orderRepository.deleteOrder({ id: orderItem.orderId });
      else {
        await this.updateOrderTotal({
          subtotal: parseFloat(orderItem.subtotal.toString()),
          orderId: orderItem.orderId,
          increase: false,
        });
      }
      return result;
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  private async getUnitPrice(productId: string) {
    try {
      return parseFloat(
        (
          (await this.productsService.detailProduct({
            id: productId,
          })) as unknown as Product
        ).price.toString(),
      );
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  private async updateOrderTotal(data: {
    amount?: number;
    orderId: string;
    subtotal?: number;
    increase: boolean;
  }) {
    try {
      let total: number = parseFloat(
        (
          (await this.orderRepository.detailOrder({
            id: data.orderId,
          })) as unknown as Order
        ).total.toString(),
      );
      if (!data.amount)
        total = data.increase ? total + data.subtotal : total - data.subtotal;
      else total = data.increase ? total + data.amount : total - data.amount;
      return await this.orderRepository.updateOrder({
        id: data.orderId,
        total: total,
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateProductsStockQuantity(data: { orderId: string }) {
    try {
      const orderItems = (await this.listOrderItemsByOrderId({
        orderId: data.orderId,
      })) as unknown as OrderItem[];

      for (const orderItem of orderItems) {
        try {
          const availability =
            await this.productsService.verifyProductAvailability({
              productId: orderItem.productId,
              quantity: orderItem.quantity,
            });

          if (!availability) {
            return new NotAcceptableException(
              'Não há itens suficientes em estoque para atender esse item do pedido.',
            );
          }

          const productstockQuantity = (
            (await this.productsService.detailProduct({
              id: orderItem.productId,
            })) as unknown as Product
          ).stockQuantity;

          const newProductStockQuantity =
            productstockQuantity - orderItem.quantity;

          await this.productsService.updateProduct({
            id: orderItem.productId,
            stockQuantity: newProductStockQuantity,
          });
        } catch (error) {
          return new NotAcceptableException(error);
        }
      }
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
