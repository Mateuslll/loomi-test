import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/client.module';
import { OrdersModule } from './modules/orders/order.module';
import { ProductsModule } from './modules/products/products.module';
import { MailService } from './modules/email-service/email-service';
import { SalesReportModule } from './modules/sales-report/sales-report.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { UserModule } from './modules/users/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { PaymentModule } from './modules/payment/payment.module';
import { JwtService } from '@nestjs/jwt';
import { UserAccessLevelMiddleware } from './modules/auth/user.middleware';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        name: process.env.MAIL_FROM,
        host: process.env.MAIL_HOST,
        secure: true,
        port: parseInt(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        ignoreTLS: true,
      },
    }),
    AuthModule,
    ClientsModule,
    ProductsModule,
    OrdersModule,
    SalesReportModule,
    UserModule,
    OrderItemsModule,
    CheckoutModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [
    MailService,
    JwtService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAccessLevelMiddleware)
      .forRoutes(
        { path: '/checkout/process-order', method: RequestMethod.POST },
        { path: '/customers/admin', method: RequestMethod.PATCH },
        { path: '/customers', method: RequestMethod.GET },
        { path: '/customers/search', method: RequestMethod.GET },
        { path: '/customers/admin', method: RequestMethod.DELETE },
        { path: '/orders-items', method: RequestMethod.GET },
        { path: '/orders-items/search', method: RequestMethod.GET },
        { path: '/orders-items', method: RequestMethod.PATCH },
        { path: '/orders-items', method: RequestMethod.DELETE },
        { path: '/orders', method: RequestMethod.GET },
        { path: '/orders/search', method: RequestMethod.GET },
        { path: '/orders', method: RequestMethod.PATCH },
        { path: '/orders', method: RequestMethod.DELETE },
        { path: '/products', method: RequestMethod.POST },
        { path: '/products', method: RequestMethod.PATCH },
        { path: '/products', method: RequestMethod.DELETE },
        { path: '/sales-report', method: RequestMethod.POST },
        { path: '/sales-report', method: RequestMethod.GET },
        { path: '/sales-report', method: RequestMethod.PATCH },
        { path: '/sales-report', method: RequestMethod.DELETE },
        { path: '/users/admin', method: RequestMethod.POST },
        { path: '/users/', method: RequestMethod.GET },
        { path: '/users/search', method: RequestMethod.GET },
        { path: '/users/admin', method: RequestMethod.PATCH },
        { path: '/users/admin', method: RequestMethod.DELETE },
      );
  }
}
