import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrdersService } from './orders.service';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Request() request) {
    const userId = request.user.id;

    return this.ordersService.createOrder(userId);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(+orderId);
  }

  @Put(':orderId/status')
  async updateOrderStatus(@Param('orderId') orderId: string, @Body() body) {
    const status = body.status;
    return this.ordersService.updateOrderStatus(+orderId, status);
  }

  @Post('apply-coupon')
  async applyCoupon(@Body() body) {
    const couponCode: string = body.couponCode;
    const orderId: number = body.orderId;
    return this.ordersService.applyCoupon(orderId, couponCode);
  }
}
