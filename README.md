<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Prerequisites

#### You need to have NodeJs, PostgreSQL and Git installed before running this project.

## API Documentation

### You need to install postman first.

Then:

- Open postman
- import collection
- select the file "API documentation.postman_collection.json"
- right click on the new collection that appeared
- view documentation

## Installing Nest CLI

```bash
$ npm install -g @nestjs/cli
```

## Clone Repository

```bash
$ git clone https://github.com/MahmoudMNael/order-management-system.git
```

## Installing required packages

```bash
$ npm install
```

## Setup your environment

### Create .env file in your project root directory

Add variables:

- DATABASE_URL with the database connection string
- JWT_SECRET with the secret key of your jwt tokens

## Run database migration

```bash
$ npx prisma migrate dev
$ npx prisma db seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```
