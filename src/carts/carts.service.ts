import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async updateCartItem(userId: number, productId: number, quantity: number) {
    const cart = await this.findOne(userId);

    const existingCartItem = await this.databaseService.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!existingCartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    return this.databaseService.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity },
    });
  }

  async removeFromCart(userId: number, productId: number) {
    const cart = await this.findOne(userId);

    return this.databaseService.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });
  }

  async clearCart(cart: { id: number }) {
    return this.databaseService.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
