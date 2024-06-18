import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

/**
 * Controller responsible for handling product-related requests.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Get all products.
   * @returns {Promise<any>} A promise that resolves to an array of products.
   */
  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  /**
   * Get a product by its ID.
   * @param {string} id - The ID of the product.
   * @returns {Promise<any>} A promise that resolves to the product with the specified ID.
   */
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
