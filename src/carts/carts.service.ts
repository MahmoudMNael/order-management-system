import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CartsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Finds a cart by user ID.
   * @param userId - The ID of the user.
   * @returns The found cart.
   * @throws NotFoundException if the cart is not found.
   */
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

  /**
   * Adds a product to the cart.
   * @param userId - The ID of the user.
   * @param productId - The ID of the product to add.
   * @param quantity - The quantity of the product to add.
   * @returns The updated cart item.
   * @throws NotFoundException if the product is not found.
   */
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

  /**
   * Updates the quantity of a cart item.
   * @param userId - The ID of the user.
   * @param productId - The ID of the product in the cart.
   * @param quantity - The new quantity of the cart item.
   * @returns The updated cart item.
   * @throws NotFoundException if the product is not found in the cart.
   */
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

  /**
   * Removes a product from the cart.
   * @param userId - The ID of the user.
   * @param productId - The ID of the product to remove.
   * @returns The number of cart items deleted.
   */
  async removeFromCart(userId: number, productId: number) {
    const cart = await this.findOne(userId);

    return this.databaseService.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });
  }

  /**
   * Clears the cart.
   * @param cart - The cart object.
   * @returns The number of cart items deleted.
   */
  async clearCart(cart: { id: number }) {
    return this.databaseService.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
