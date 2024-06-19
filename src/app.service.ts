import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

/**
 * Service responsible for handling application-level operations.
 */
@Injectable()
export class AppService {
  /**
   * Returns a greeting message.
   * @returns The greeting message.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
