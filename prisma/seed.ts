import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.$queryRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  await prisma.user.create({
    data: {
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      address: 'Hadayek ElAhram, Giza, Egypt',
      password: '12345678',
    },
  });

  await prisma.$queryRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
  await prisma.product.createMany({
    data: [
      { name: 'Iphone 11', price: 20, stock: 2 },
      { name: 'Iphone 12', price: 30, stock: 3 },
      { name: 'Iphone 13', price: 40, stock: 1 },
      { name: 'Iphone 14', price: 50, stock: 0 },
      {
        name: 'Mug',
        description: "It's a regular mug",
        price: 5,
        stock: 100,
      },
    ],
  });

  await prisma.$queryRaw`TRUNCATE TABLE "Coupon" CASCADE;`;
  await prisma.coupon.createMany({
    data: [
      { code: '10OFF', discount: 10, maxUses: 30 },
      { code: '20OFF', discount: 20, maxUses: 20 },
      { code: '30OFF', discount: 30, maxUses: 10 },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
