import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as randomEmail from 'random-email';
import { DatabaseService } from '../src/database/database.service';

let email = randomEmail();

jest.mock('./../src/auth/auth.guard.ts', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockImplementation((context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request['user'] = {
        id: 1,
        email,
        name: 'Mahmoud Nael',
        address: 'Hadayek ElAhram, Giza, Egypt',
      };
      return true;
    }),
  })),
}));

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: '12345678',
        name: 'Mahmoud Nael',
        address: 'Hadayek ElAhram, Giza, Egypt',
      })
      .expect(201);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: '12345678',
      })
      .expect(200);
  });

  it('/auth/profile (GET)', () => {
    return request(app.getHttpServer()).get('/auth/profile').expect(200);
  });

  it('/carts/my-cart (GET)', () => {
    return request(app.getHttpServer()).get('/carts/my-cart').expect(200);
  });

  it('/carts/:userId (GET)', () => {
    return request(app.getHttpServer()).get('/carts/1').expect(200);
  });

  it('/carts/add (POST)', () => {
    return request(app.getHttpServer())
      .post('/carts/add')
      .send({
        productId: 5,
        quantity: 1,
      })
      .expect(201);
  });

  it('/carts/add (POST) 2', () => {
    return request(app.getHttpServer())
      .post('/carts/add')
      .send({
        productId: 1,
        quantity: 1,
      })
      .expect(201);
  });

  it('/carts/update (PUT)', () => {
    return (
      request(app.getHttpServer())
        .put('/carts/update')
        // .send({
        //   productId: 5,
        //   quantity: 2,
        // })
        .expect(200)
    );
  });

  it('/carts/remove (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/carts/remove')
      .send({ productId: 1 })
      .expect(200);
  });

  it('/orders (POST)', () => {
    return request(app.getHttpServer()).post('/orders').expect(201);
  });

  it('/orders/:orderId (GET)', () => {
    return request(app.getHttpServer()).get('/orders/1').expect(200);
  });

  it('/orders/:orderId/status (PUT)', () => {
    return request(app.getHttpServer())
      .put('/orders/1/status')
      .send({ status: 'proccessing' })
      .expect(200);
  });

  it('/orders/apply-coupon (POST)', () => {
    return request(app.getHttpServer())
      .post('/orders/apply-coupon')
      .send({ couponCode: '10OFF', orderId: 1 })
      .expect(201);
  });

  it('/users/:userId/orders (GET)', () => {
    return request(app.getHttpServer()).get('/users/1/orders').expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
