import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsRepository } from './order-items.repository';
import { OrdersRepository } from '../orders/order.repository';
import { ProductsService } from '../products/products.service';
import { ProductsRepository } from '../products/product.repository';

@Module({
  controllers: [OrderItemsController],
  providers: [
    OrderItemsService,
    OrderItemsRepository,
    ProductsService,
    ProductsRepository,
    OrdersRepository,
  ],
})
export class OrderItemsModule {}
