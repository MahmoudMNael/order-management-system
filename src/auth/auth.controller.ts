import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dtos/signin-user.dto';
import { Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(
    @Body() signInUserDto: SignInUserDto,
    @Res() response: Response,
  ) {
    const access_token = await this.authService.signIn(signInUserDto);
    response.cookie('jwt', access_token, { httpOnly: true });
    response.status(200).json({ message: 'Login successful' });
    return response;
  }

  @Post('register')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const access_token = await this.authService.signUp(createUserDto);
    response.cookie('jwt', access_token, { httpOnly: true });
    response.status(201).json({ message: 'User created' });
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
