import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

/**
 * Service responsible for handling coupon-related operations.
 */
@Injectable()
export class CouponsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Retrieves all coupons.
   * @returns A promise that resolves to an array of coupons.
   */
  async findAll() {
    return this.databaseService.coupon.findMany({});
  }
}
