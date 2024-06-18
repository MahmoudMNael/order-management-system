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
  }

  getHello(): string {
    return 'Hello World!';
  }
}
