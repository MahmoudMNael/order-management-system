import { forwardRef, Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [UsersModule, CartsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
