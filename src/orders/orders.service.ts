import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsService } from 'src/carts/carts.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartsService: CartsService,
  ) {}

  async findOne(id: number) {
    return this.databaseService.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { product: true } },
        user: { select: { password: false } },
      },
    });
  }

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

  async updateOrderStatus(id: number, status: string) {
    return this.databaseService.order.update({
      where: { id },
      data: { status },
    });
  }

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
