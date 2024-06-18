import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get('my-cart')
  async getMyCart(@Request() request) {
    const userId = request.user.id;

    return this.cartsService.findOne(userId);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartsService.findOne(+userId);
  }

  @Post('add')
  async addToCart(@Request() request, @Body() body) {
    const userId = request.user.id;
    const productId = body.productId;
    const quantity = body.quantity;

    return this.cartsService.addToCart(userId, productId, quantity);
  }
}
