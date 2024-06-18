import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'node:crypto';
import { SignInUserDto } from './dtos/signin-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async hashPasswordRandomly(password: string): Promise<string> {
    const salt = crypto.randomBytes(8).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 310000, 64, 'sha512')
      .toString('hex');

    const passwordToSave = `${salt}.${hashedPassword}`;

    return passwordToSave;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 310000, 64, 'sha512')
      .toString('hex');

    const passwordToSave = `${salt}.${hashedPassword}`;

    return passwordToSave;
  }

  async signIn(signInUserDto: SignInUserDto): Promise<string> {
    const user = await this.usersService.findOne(signInUserDto.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const hashedPassword = await this.hashPassword(
      signInUserDto.password,
      user.password.split('.')[0],
    );
    if (hashedPassword !== user.password) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }

  async signUp(createUserDto: CreateUserDto): Promise<string> {
    const existingUser = await this.usersService.findOne(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with that email already exists');
    }

    const passwordToSave = await this.hashPasswordRandomly(
      createUserDto.password,
    );

    const user = await this.usersService.create({
      email: createUserDto.email,
      name: createUserDto.name,
      address: createUserDto.address,
      password: passwordToSave,
    });

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }
}
