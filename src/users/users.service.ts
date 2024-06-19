import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @returns A Promise that resolves to the found user.
   */
  async findOne(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  /**
   * Creates a new user.
   * @param data - The data of the user to create.
   * @returns A Promise that resolves to the created user.
   */
  async create(data: Prisma.UserCreateInput) {
    const user = await this.databaseService.user.create({ data });
    return user;
  }

  /**
   * Updates a user by ID.
   * @param id - The ID of the user to update.
   * @param data - The updated data of the user.
   * @returns A Promise that resolves to the updated user.
   */
  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.databaseService.user.update({
      where: { id },
      data,
    });
    return user;
  }

  /**
   * Finds all orders for a given user.
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to an array of orders.
   */
  async findUserOrders(userId: number) {
    return this.databaseService.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
      },
      orderBy: { orderDate: 'desc' },
    });
  }
}
