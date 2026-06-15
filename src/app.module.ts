import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { ProductModule } from './core/product/product.module';
import { RequestMiddleware } from '@middlewares/request.middleware';
import { AdminModule } from './core/admin/admin.module';
import { OrderModule } from './core/order/order.module';
import { NotificationModule } from './core/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
     PrismaModule,
      AuthModule,
      ProductModule,
      AdminModule,
      OrderModule,
      NotificationModule,
    ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes('*');
  }
}
