import prisma from '@/prismaClient';


export default async function globalTeardown() {
  await prisma.comment.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
}