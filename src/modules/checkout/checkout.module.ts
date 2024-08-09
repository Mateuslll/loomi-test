import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OrderItemsRepository } from '../order-items/order-items.repository';
import { OrderItemsService } from '../order-items/order-items.service';
import { OrdersRepository } from '../orders/order.repository';
import { OrdersService } from '../orders/order.service';
import { ProductsRepository } from '../products/product.repository';
import { ProductsService } from '../products/products.service';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';

@Module({
  imports: [HttpModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    OrdersService,
    OrderItemsService,
    ProductsService,
    OrdersRepository,
    OrderItemsRepository,
    ProductsRepository,
  ],
})
export class CheckoutModule {}
