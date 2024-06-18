import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CartsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(userId: number) {
    const cart = await this.databaseService.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    const cart = await this.findOne(userId);

    const product = await this.databaseService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingCartItem = cart.cartItems.find(
      (cartItem) => cartItem.productId === productId,
    );

    if (existingCartItem) {
      return this.databaseService.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity },
      });
    }

    return this.databaseService.cartItem.create({
      data: {
        quantity,
        productId: productId,
        cartId: cart.id,
      },
    });
  }
}
