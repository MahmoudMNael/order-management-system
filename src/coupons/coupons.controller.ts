import { Controller, Get } from '@nestjs/common';
import { CouponsService } from './coupons.service';

/**
 * Controller responsible for handling coupon-related requests.
 */
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  /**
   * Retrieves all coupons.
   * @returns A promise that resolves to an array of coupons.
   */
  @Get()
  async findAll() {
    return this.couponsService.findAll();
  }
}
