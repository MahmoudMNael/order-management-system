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

/**
 * Controller responsible for handling order-related requests.
 */
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Create a new order.
   * @param request - The request object containing user information.
   * @returns The created order.
   */
  @Post()
  async createOrder(@Request() request) {
    const userId = request.user.id;

    return this.ordersService.createOrder(userId);
  }

  /**
   * Get an order by its ID.
   * @param orderId - The ID of the order to retrieve.
   * @returns The order with the specified ID.
   */
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(+orderId);
  }

  /**
   * Update the status of an order.
   * @param orderId - The ID of the order to update.
   * @param body - The request body containing the new status.
   * @returns The updated order.
   */
  @Put(':orderId/status')
  async updateOrderStatus(@Param('orderId') orderId: string, @Body() body) {
    const status = body.status;
    return this.ordersService.updateOrderStatus(+orderId, status);
  }

  /**
   * Apply a coupon to an order.
   * @param body - The request body containing the coupon code and order ID.
   * @returns The updated order with the applied coupon.
   */
  @Post('apply-coupon')
  async applyCoupon(@Body() body) {
    const couponCode: string = body.couponCode;
    const orderId: number = body.orderId;
    return this.ordersService.applyCoupon(orderId, couponCode);
  }
}
