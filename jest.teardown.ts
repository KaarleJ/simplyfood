import prisma from '@/lib/prismaClient';


export default async function globalTeardown() {
  console.log('Teardown: Clearing database...');
  await prisma.comment.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  console.log('Teardown: Database cleared, connection closed');
}