import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

/**
 * Service responsible for handling product-related operations.
 */
@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Finds a product by its ID.
   * @param id - The ID of the product.
   * @returns The found product.
   * @throws NotFoundException if the product is not found.
   */
  async findOne(id: number) {
    const product = await this.databaseService.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  /**
   * Finds all products.
   * @returns An array of all products.
   */
  async findAll() {
    const products = await this.databaseService.product.findMany({});
    return products;
  }
}
