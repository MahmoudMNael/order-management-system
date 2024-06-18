import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly databaseService: DatabaseService) {}
  async onApplicationBootstrap() {
    await this.databaseService
      .$queryRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
    await this.databaseService.product.createMany({
      data: [
        { name: 'Iphone 11', price: 20, stock: 2 },
        { name: 'Iphone 12', price: 30, stock: 3 },
        { name: 'Iphone 13', price: 40, stock: 1 },
        { name: 'Iphone 14', price: 50, stock: 0 },
        {
          name: 'Mug',
          description: "It's a regular mug",
          price: 5,
          stock: 100,
        },
      ],
    });

    await this.databaseService.$queryRaw`TRUNCATE TABLE "Coupon" CASCADE;`;
    await this.databaseService.coupon.createMany({
      data: [
        { code: '10OFF', discount: 10, maxUses: 30 },
        { code: '20OFF', discount: 20, maxUses: 20 },
        { code: '30OFF', discount: 30, maxUses: 10 },
      ],
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
