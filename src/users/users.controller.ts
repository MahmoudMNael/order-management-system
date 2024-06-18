import { Controller, forwardRef, Get, Inject, Param } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from './users.service';

/**
 * Controller responsible for handling user-related requests.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get a user by their ID.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the user with the specified ID.
   */
  @Get(':userId/orders')
  async getUserOrders(@Param('userId') userId: string) {
    return this.usersService.findUserOrders(+userId);
  }
}
