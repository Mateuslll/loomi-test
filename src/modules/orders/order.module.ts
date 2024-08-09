import { Module } from '@nestjs/common';
import { OrderItemsRepository } from '../order-items/order-items.repository';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsRepository } from '../products/product.repository';
import { ProductsService } from '../products/products.service';
import { OrdersController } from './order.controller';
import { OrdersRepository } from './order.repository';
import { OrdersService } from './order.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    OrderItemsService,
    OrderItemsRepository,
    ProductsService,
    ProductsRepository,
  ],
})
export class OrdersModule {}
