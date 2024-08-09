import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDTO } from './dto/create-order.dto';
import { DeleteOrderDTO } from './dto/delete-order.dto';
import { GetOrderDTO } from './dto/get-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { SearchOrderDTO } from './dto/search-order.dto';

export class OrdersRepository {
  prisma = new PrismaClient();

  async createOrder(data: CreateOrderDTO) {
    try {
      return await this.prisma.order.create({
        data: {
          client: {
            connect: {
              id: data.clientId,
            },
          },
          status: data.status,
          quantity: data.quantity,
          total: data.total,
        },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async listOrders(data: SearchOrderDTO) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          clientId: data.clientId ? { equals: data.clientId } : undefined,
          total: data.total ? { equals: data.total } : undefined,
          orderStatus: data.orderStatus
            ? { equals: data.orderStatus }
            : undefined,
          requestedAt:
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

      return { orders };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
  async detailOrder(data: GetOrderDTO) {
    try {
      return await this.prisma.order.findUnique({ where: { id: data.id } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateOrder(data: UpdateOrderDTO) {
    try {
      const { id, ...parameters } = data;
      return await this.prisma.order.update({
        where: {
          id: id,
        },
        data: { ...parameters },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteOrder(data: DeleteOrderDTO) {
    try {
      return await this.prisma.order.delete({ where: { id: data.id } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
