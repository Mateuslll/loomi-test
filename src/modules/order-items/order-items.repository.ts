import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';
import { DeleteOrderItemDTO } from './dto/delete-order-item.dto';
import { GetOrderItemDTO } from './dto/get-order-item.dto';
import { ListOrderItemsByOrderId } from './dto/list-order-items-by-order-id.dto';
import { UpdateOrderItemDTO } from './dto/update-order-item.dto';
import { SearchOrderItemDTO } from './dto/search-order-item.dto';

export class OrderItemsRepository {
  prisma = new PrismaClient();

  async createOrderItem(
    data: CreateOrderItemDTO,
    unitPrice: number,
    subtotal: number,
  ) {
    try {
      return await this.prisma.orderItem.create({
        data: {
          order: {
            connect: {
              id: data.orderId,
            },
          },
          product: {
            connect: {
              id: data.productId,
            },
          },
          quantity: data.quantity,
          unitPrice: unitPrice,
          subtotal: subtotal,
        },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async listOrderItem(data: SearchOrderItemDTO) {
    try {
      const orderItems = await this.prisma.orderItem.findMany({
        where: {
          orderId: data.orderId ? { equals: data.orderId } : undefined,
          productId: data.productId ? { equals: data.productId } : undefined,
          quantity: data.quantity ? { equals: data.quantity } : undefined,
          createdAt:
            data.date_start && data.date_end
              ? {
                  gte: new Date(data.date_start),
                  lte: new Date(data.date_end),
                }
              : undefined,
        },
        take: data.records_per_page,
        skip: (data.page - 1) * data.records_per_page,
      });

      return { orderItems };
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async listOrderItemsByOrderId(data: ListOrderItemsByOrderId) {
    try {
      return await this.prisma.orderItem.findMany({
        where: {
          orderId: data.orderId,
        },
      });
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async detailOrderItem(data: GetOrderItemDTO) {
    try {
      return await this.prisma.orderItem.findUnique({ where: { id: data.id } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateOrderItem(data: UpdateOrderItemDTO, subtotal: number) {
    try {
      return await this.prisma.orderItem.update({
        where: {
          id: data.id,
        },
        data: { quantity: data.quantity, subtotal: subtotal },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateOrderItemSubtotal(id: string, subtotal: number) {
    try {
      return await this.prisma.orderItem.update({
        where: {
          id: id,
        },
        data: { subtotal: subtotal },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteOrderItem(data: DeleteOrderItemDTO) {
    try {
      return await this.prisma.orderItem.delete({ where: { id: data.id } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
