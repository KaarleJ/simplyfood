import prisma from '@/lib/prismaClient';


export default async function globalSetup() {
  console.log('Setup: Clearing database...');
  await prisma.comment.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  console.log('Setup: Database cleared');
}