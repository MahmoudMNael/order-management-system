/**
 * A guard that checks if a user is authenticated.
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'dotenv';
import { UsersService } from 'src/users/users.service';
config();

type Payload = {
  id: number;
  email: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * Determines if a user is authenticated to access a route.
   * @param context - The execution context of the route.
   * @returns A boolean indicating if the user is authorized.
   * @throws UnauthorizedException if the user is not authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = await this.usersService.findOne(payload.email);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the JWT token from the request header.
   * @param request - The HTTP request object.
   * @returns The JWT token or undefined if not found.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.cookies['jwt'];
    return token;
  }
}
