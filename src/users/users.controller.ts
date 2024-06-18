import { Controller, forwardRef, Get, Inject, Param } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/orders')
  async getUserOrders(@Param('userId') userId: string) {
    return this.usersService.findUserOrders(+userId);
  }
}
