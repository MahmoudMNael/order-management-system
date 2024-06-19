import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  /**
   * Get the cart for the currently authenticated user.
   * @param request - The request object.
   * @returns The cart for the currently authenticated user.
   */
  @Get('my-cart')
  async getMyCart(@Request() request) {
    const userId = request.user.id;

    return this.cartsService.findOne(userId);
  }

  /**
   * Get the cart for a specific user.
   * @param userId - The ID of the user.
   * @returns The cart for the specified user.
   */
  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartsService.findOne(+userId);
  }

  /**
   * Add a product to the cart of the currently authenticated user.
   * @param request - The request object.
   * @param body - The request body containing the product ID and quantity.
   * @returns The updated cart after adding the product.
   */
  @Post('add')
  async addToCart(@Request() request, @Body() body) {
    const userId = request.user.id;
    const productId = body.productId;
    const quantity = body.quantity;

    return this.cartsService.addToCart(userId, productId, quantity);
  }

  /**
   * Update the quantity of a product in the cart of the currently authenticated user.
   * @param body - The request body containing the product ID and updated quantity.
   * @param request - The request object.
   * @returns The updated cart after updating the product quantity.
   */
  @Put('update')
  async updateCartItem(@Body() body, @Request() request) {
    const userId = request.user.id;
    const productId = body.productId;
    const quantity = body.quantity;

    return this.cartsService.updateCartItem(userId, productId, quantity);
  }

  /**
   * Remove a product from the cart of the currently authenticated user.
   * @param body - The request body containing the product ID.
   * @param request - The request object.
   * @returns The updated cart after removing the product.
   */
  @Delete('remove')
  async removeFromCart(@Body() body, @Request() request) {
    const userId = request.user.id;
    const productId = body.productId;

    return this.cartsService.removeFromCart(userId, productId);
  }
}
