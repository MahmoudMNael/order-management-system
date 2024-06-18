import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsService } from 'src/carts/carts.service';
import { DatabaseService } from 'src/database/database.service';

/**
 * Service responsible for handling order-related operations.
 */
@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartsService: CartsService,
  ) {}

  /**
   * Finds an order by its ID.
   * @param id - The ID of the order.
   * @returns A promise that resolves to the found order.
   */
  async findOne(id: number) {
    return this.databaseService.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { product: true } },
        user: { select: { password: false } },
      },
    });
  }

  /**
   * Creates a new order for a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the created order.
   * @throws NotFoundException if the user's cart is not found or a product is out of stock.
   */
  async createOrder(userId: number) {
    const cart = await this.cartsService.findOne(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    for (const cartItem of cart.cartItems) {
      if (cartItem.quantity > cartItem.product.stock) {
        throw new NotFoundException({
          message: `Product out of stock`,
          product: cartItem.product,
        });
      }
    }

    const orderItems = cart.cartItems.map((cartItem) => ({
      quantity: cartItem.quantity,
      productId: cartItem.productId,
    }));

    const order = await this.databaseService.order.create({
      data: {
        userId: userId,
        orderItems: { create: orderItems },
      },
      include: { orderItems: { include: { product: true } } },
    });

    await this.cartsService.clearCart(cart);

    for (const orderItem of order.orderItems) {
      await this.databaseService.product.update({
        where: { id: orderItem.productId },
        data: { stock: { decrement: orderItem.quantity } },
      });
    }

    return order;
  }

  /**
   * Updates the status of an order.
   * @param id - The ID of the order.
   * @param status - The new status of the order.
   * @returns A promise that resolves to the updated order.
   */
  async updateOrderStatus(id: number, status: string) {
    return this.databaseService.order.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Applies a coupon to an order.
   * @param orderId - The ID of the order.
   * @param couponCode - The code of the coupon to apply.
   * @returns A promise that resolves to the updated order.
   * @throws NotFoundException if the coupon is already applied.
   */
  async applyCoupon(orderId: number, couponCode: string) {
    const coupon = await this.databaseService.coupon.findUnique({
      where: { code: couponCode },
    });

    if (coupon) {
      throw new NotFoundException('Coupon already applied');
    }

    let order = await this.databaseService.order.update({
      where: { id: orderId },
      data: { discount: coupon.discount },
    });

    if (coupon.maxUses === 1) {
      await this.databaseService.coupon.delete({
        where: { code: couponCode },
      });
    } else {
      await this.databaseService.coupon.update({
        where: { code: couponCode },
        data: { maxUses: { decrement: 1 } },
      });
    }

    return order;
  }
}
