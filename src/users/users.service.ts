import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await this.databaseService.user.create({ data });
    return user;
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.databaseService.user.update({
      where: { id },
      data,
    });
    return user;
  }

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
